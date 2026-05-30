import { streamText } from 'ai';
import { getLanguageModel } from '@/lib/ai/providers';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { getNextPhase, shouldAdvancePhase } from '@/lib/ai/state-machine';
import {
  getSession,
  updateSession,
  appendToHistory,
  getConversationHistory,
  createSession,
} from '@/lib/storage';
import { InterviewPhase } from '@/lib/types';

// toTextStreamResponse() silently swallows errors — stream manually to surface them
function streamWithErrors(
  result: ReturnType<typeof streamText>,
  headers: Record<string, string>
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('streamText error:', msg);
        controller.enqueue(encoder.encode(`[AI错误: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...headers },
  });
}

export async function POST(req: Request) {
  try {
  const body = await req.json();
  const { sessionId, message, action } = body;

  // Create new session
  if (action === 'create') {
    const { department, tenure, roleLevel } = body;
    const session = createSession({ department, tenure, roleLevel });

    // Generate initial greeting
    const systemPrompt = getSystemPrompt('warmup', {
      department: session.department,
      tenure: session.tenure,
      roleLevel: session.roleLevel,
    });

    const result = streamText({
      model: getLanguageModel(),
      system: systemPrompt,
      messages: [
        { role: 'user', content: '（员工已进入对话）' }
      ],
    });

    // Save the initial message to history
    appendToHistory(session.id, { role: 'user', content: '（员工已进入对话）' });

    return streamWithErrors(result, {
      'X-Session-Id': session.id,
      'X-Phase': session.currentPhase,
    });
  }

  // Continue conversation
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing sessionId' }), { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404 });
  }

  // Append user message
  appendToHistory(sessionId, { role: 'user', content: message });

  // Check if should advance phase
  const currentPhaseCount = session.phaseMessageCounts[session.currentPhase] + 1;
  let newPhase = session.currentPhase;

  if (shouldAdvancePhase(session.currentPhase, currentPhaseCount)) {
    const nextPhase = getNextPhase(session.currentPhase);
    if (nextPhase) {
      newPhase = nextPhase;
    }
  }

  // Update session
  const updatedCounts = { ...session.phaseMessageCounts };
  updatedCounts[session.currentPhase] = currentPhaseCount;

  updateSession(sessionId, {
    currentPhase: newPhase,
    phaseMessageCounts: updatedCounts,
    ...(newPhase === 'closing' ? { completedAt: new Date().toISOString() } : {}),
  });

  // Build messages for LLM
  const history = getConversationHistory(sessionId);
  const systemPrompt = getSystemPrompt(newPhase, {
    department: session.department,
    tenure: session.tenure,
    roleLevel: session.roleLevel,
  });

  const messages = history.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const result = streamText({
    model: getLanguageModel(),
    system: systemPrompt,
    messages,
  });

  return streamWithErrors(result, {
    'X-Session-Id': sessionId,
    'X-Phase': newPhase,
  });
  } catch (error) {
    console.error('Chat API error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

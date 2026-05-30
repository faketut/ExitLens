import { streamText } from 'ai';
import { getLanguageModel } from '@/lib/ai/providers';
import { getSystemPrompt, getPhaseTransitionPrompt } from '@/lib/ai/prompts';
import { getNextPhase, shouldAdvancePhase } from '@/lib/ai/state-machine';
import {
  getSession,
  updateSession,
  appendToHistory,
  getConversationHistory,
  createSession,
} from '@/lib/storage';
import { InterviewPhase } from '@/lib/types';

export async function POST(req: Request) {
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

    const response = result.toTextStreamResponse({
      headers: {
        'X-Session-Id': session.id,
        'X-Phase': session.currentPhase,
      },
    });
    return response;
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

  return result.toTextStreamResponse({
    headers: {
      'X-Session-Id': sessionId,
      'X-Phase': newPhase,
    },
  });
}

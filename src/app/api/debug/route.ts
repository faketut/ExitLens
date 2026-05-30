export const runtime = 'nodejs';

export async function GET() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Test 1: GET /v1/models
  let getTest: { ok: boolean; status?: number; error?: string } = { ok: false };
  try {
    const res = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: { Authorization: `Bearer ${deepseekKey ?? 'test'}` },
      signal: AbortSignal.timeout(8000),
    });
    getTest = { ok: res.ok, status: res.status };
  } catch (e) {
    getTest = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Test 2: POST /v1/chat/completions (non-streaming)
  let postTest: { ok: boolean; status?: number; body?: string; error?: string } = { ok: false };
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${deepseekKey ?? 'test'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Reply with just "ok".' }],
        max_tokens: 5,
        stream: false,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    postTest = { ok: res.ok, status: res.status, body: text.slice(0, 300) };
  } catch (e) {
    postTest = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return Response.json({
    env: {
      hasDeepSeekKey: !!deepseekKey,
      deepseekKeyPrefix: deepseekKey ? deepseekKey.slice(0, 8) + '...' : 'NOT SET',
      hasOpenAIKey: !!openaiKey,
      hasAnthropicKey: !!anthropicKey,
      openaiBaseUrl: process.env.OPENAI_BASE_URL ?? 'not set',
    },
    tests: { get: getTest, post: postTest },
    node: process.version,
  });
}

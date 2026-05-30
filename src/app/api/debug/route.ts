export const runtime = 'nodejs';

export async function GET() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Quick connectivity test to DeepSeek (no auth needed for reachability check)
  let connectTest: { ok: boolean; status?: number; error?: string } = { ok: false };
  try {
    const res = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: { Authorization: `Bearer ${deepseekKey ?? 'test'}` },
      signal: AbortSignal.timeout(5000),
    });
    connectTest = { ok: true, status: res.status };
  } catch (e) {
    connectTest = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return Response.json({
    env: {
      hasDeepSeekKey: !!deepseekKey,
      deepseekKeyPrefix: deepseekKey ? deepseekKey.slice(0, 8) + '...' : 'NOT SET',
      hasOpenAIKey: !!openaiKey,
      hasAnthropicKey: !!anthropicKey,
    },
    connectivity: connectTest,
    node: process.version,
  });
}

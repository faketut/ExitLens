import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export type ModelProvider = 'openai' | 'anthropic' | 'deepseek';

interface ProviderConfig {
  provider: ModelProvider;
  model: string;
}

function getProviderConfig(): ProviderConfig {
  // Priority: check which API keys are available
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', model: process.env.OPENAI_MODEL || 'gpt-4o' };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514' };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return { provider: 'deepseek', model: process.env.DEEPSEEK_MODEL || 'deepseek-chat' };
  }
  // Fallback for demo - will show error if no key configured
  return { provider: 'openai', model: 'gpt-4o' };
}

export function getLanguageModel() {
  const config = getProviderConfig();

  switch (config.provider) {
    case 'openai':
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openai(config.model);

    case 'anthropic':
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      return anthropic(config.model);

    case 'deepseek':
      // DeepSeek uses OpenAI-compatible API
      const deepseek = createOpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
      });
      return deepseek(config.model);
  }
}


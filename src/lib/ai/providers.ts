import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

export type ModelProvider = 'openai' | 'anthropic' | 'deepseek' | 'gemini';

interface ProviderConfig {
  provider: ModelProvider;
  model: string;
}

function buildModel(config: ProviderConfig): LanguageModel {
  switch (config.provider) {
    case 'openai':
      return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(config.model);
    case 'anthropic':
      return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(config.model);
    case 'deepseek':
      return createOpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com/v1' })(config.model);
    case 'gemini':
      return createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })(config.model);
  }
}

// Returns all configured providers in priority order; first one is primary, rest are fallbacks.
export function getLanguageModels(): LanguageModel[] {
  const candidates: ProviderConfig[] = [];

  if (process.env.OPENAI_API_KEY)    candidates.push({ provider: 'openai',    model: process.env.OPENAI_MODEL    || 'gpt-4o' });
  if (process.env.ANTHROPIC_API_KEY) candidates.push({ provider: 'anthropic', model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514' });
  if (process.env.DEEPSEEK_API_KEY)  candidates.push({ provider: 'deepseek',  model: process.env.DEEPSEEK_MODEL  || 'deepseek-chat' });
  if (process.env.GEMINI_API_KEY)    candidates.push({ provider: 'gemini',    model: process.env.GEMINI_MODEL    || 'gemini-2.0-flash' });

  if (candidates.length === 0) {
    // No keys configured — will fail with a clear error at call time
    candidates.push({ provider: 'openai', model: 'gpt-4o' });
  }

  return candidates.map(buildModel);
}

// Convenience: returns just the primary model (for callers that don't need fallback)
export function getLanguageModel(): LanguageModel {
  return getLanguageModels()[0];
}


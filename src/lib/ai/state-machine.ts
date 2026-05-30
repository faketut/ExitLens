import { InterviewPhase } from '../types';

export const PHASE_CONFIG: Record<InterviewPhase, {
  name: string;
  description: string;
  minMessages: number;
  maxMessages: number;
}> = {
  warmup: {
    name: '开场破冰',
    description: '建立信任，说明AI保密性',
    minMessages: 2,
    maxMessages: 4,
  },
  surface: {
    name: '表层原因',
    description: '了解离职的直接原因',
    minMessages: 2,
    maxMessages: 5,
  },
  deep_dive: {
    name: '深层挖掘',
    description: '运用动机访谈技术探索深层因素',
    minMessages: 4,
    maxMessages: 8,
  },
  validation: {
    name: '验证确认',
    description: '反映式倾听，确认对问题的理解',
    minMessages: 2,
    maxMessages: 4,
  },
  suggestions: {
    name: '建议收集',
    description: '组织可以做出哪些改变',
    minMessages: 2,
    maxMessages: 5,
  },
  closing: {
    name: '结束感谢',
    description: '致谢并提供后续支持',
    minMessages: 1,
    maxMessages: 2,
  },
};

export const PHASES_ORDER: InterviewPhase[] = [
  'warmup', 'surface', 'deep_dive', 'validation', 'suggestions', 'closing'
];

export function getNextPhase(current: InterviewPhase): InterviewPhase | null {
  const idx = PHASES_ORDER.indexOf(current);
  if (idx === -1 || idx >= PHASES_ORDER.length - 1) return null;
  return PHASES_ORDER[idx + 1];
}

export function shouldAdvancePhase(
  currentPhase: InterviewPhase,
  messageCount: number
): boolean {
  const config = PHASE_CONFIG[currentPhase];
  return messageCount >= config.minMessages;
}

export function getPhaseProgress(currentPhase: InterviewPhase): number {
  const idx = PHASES_ORDER.indexOf(currentPhase);
  return ((idx + 1) / PHASES_ORDER.length) * 100;
}

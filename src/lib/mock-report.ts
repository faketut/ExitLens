export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MockReasonDistributionItem {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface MockActionableItem {
  priority: 'high' | 'medium' | 'low';
  reason: string;
  text: string;
  dept: string;
  mentions: number;
  quote?: string;
}

export interface MockQuoteItem {
  id: number;
  text: string;
  dept: string;
  context: string;
}

export interface MockSessionReport {
  generatedAt: string;
  source: 'session-mock';
  summary: {
    totalInterviews: number;
    completionRate: number;
    avgDuration: number;
    avgInsightsPerSession: number;
    retentionRiskScore: number;
    topCategory: string;
  };
  reasonDistribution: MockReasonDistributionItem[];
  actionableItems: MockActionableItem[];
  quotesByReason: Record<string, MockQuoteItem[]>;
}

const STORAGE_KEY = 'exitlens.latestMockReport.v1';

const REASON_COLOR: Record<string, string> = {
  管理问题: 'bg-[#da1e28]',
  成长空间: 'bg-[#0f62fe]',
  薪资待遇: 'bg-[#f1c21b]',
  企业文化: 'bg-[#8a3ffc]',
  工作压力: 'bg-[#ff832b]',
  认可感缺失: 'bg-[#d12771]',
  其他: 'bg-[#8d8d8d]',
};

const CANONICAL_REASONS = ['管理问题', '成长空间', '薪资待遇', '企业文化', '工作压力', '认可感缺失', '其他'];

const REASON_KEYWORDS: Record<string, string[]> = {
  管理问题: ['领导', '管理', '沟通', 'leader', '汇报', '决策'],
  成长空间: ['成长', '技术栈', '学习', '路线图', '晋升', '发展'],
  薪资待遇: ['薪资', '工资', 'offer', 'package', '调薪', '涨薪'],
  企业文化: ['文化', '氛围', '政治', '价值观', 'okr'],
  工作压力: ['加班', '压力', '负荷', '996', '疲惫', '周末'],
  认可感缺失: ['认可', '看见', '尊重', '功劳', '反馈'],
};

function normalizeReason(reason: string): string {
  if (CANONICAL_REASONS.includes(reason)) return reason;
  return '其他';
}

function reasonFromText(text: string): string {
  const lower = text.toLowerCase();
  for (const [reason, words] of Object.entries(REASON_KEYWORDS)) {
    if (words.some((w) => lower.includes(w.toLowerCase()))) return reason;
  }
  return '其他';
}

function aggregateReasonCounts(userTexts: string[]): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(CANONICAL_REASONS.map((r) => [r, 0]));
  userTexts.forEach((text) => {
    const reason = normalizeReason(reasonFromText(text));
    counts[reason] += 1;
  });

  if (Object.values(counts).every((v) => v === 0)) {
    counts['其他'] = 1;
  }

  return counts;
}

function buildActionableItems(topReason: string, userTexts: string[]): MockActionableItem[] {
  const firstQuote = userTexts[0] || '离职原因较复杂，建议通过更多样本持续观察。';
  const lastQuote = userTexts[userTexts.length - 1] || firstQuote;

  const templates: Record<string, MockActionableItem[]> = {
    '管理问题': [
      { priority: 'high', reason: '管理问题', text: '稳定直属管理关系，减少频繁组织调整带来的协作摩擦', dept: '技术部', mentions: 6, quote: firstQuote },
      { priority: 'medium', reason: '管理问题', text: '建立跨层级沟通机制，关键决策透明同步到执行层', dept: '全部', mentions: 4, quote: lastQuote },
    ],
    '成长空间': [
      { priority: 'high', reason: '成长空间', text: '发布季度技术路线图并绑定个人成长路径', dept: '技术部', mentions: 7, quote: firstQuote },
      { priority: 'medium', reason: '成长空间', text: '补齐晋升标准与能力反馈节奏', dept: '产品部', mentions: 5, quote: lastQuote },
    ],
    '薪资待遇': [
      { priority: 'high', reason: '薪资待遇', text: '按岗位带宽做市场对标，拉齐核心岗位薪资竞争力', dept: '全部', mentions: 6, quote: firstQuote },
      { priority: 'medium', reason: '薪资待遇', text: '增加关键人才季度保留激励机制', dept: '技术部', mentions: 4, quote: lastQuote },
    ],
    '企业文化': [
      { priority: 'high', reason: '企业文化', text: '推动管理层行为一致性，减少口号与执行割裂', dept: '全部', mentions: 5, quote: firstQuote },
      { priority: 'medium', reason: '企业文化', text: '建立匿名反馈闭环，按月公示改进行动', dept: '全部', mentions: 4, quote: lastQuote },
    ],
    '工作压力': [
      { priority: 'high', reason: '工作压力', text: '治理高峰期无序加班，设置项目排期红线', dept: '技术部', mentions: 6, quote: firstQuote },
      { priority: 'medium', reason: '工作压力', text: '引入人力容量评估，防止关键岗位长期超载', dept: '运营部', mentions: 4, quote: lastQuote },
    ],
    '认可感缺失': [
      { priority: 'high', reason: '认可感缺失', text: '建立关键贡献可视化机制，确保成果被及时确认', dept: '全部', mentions: 5, quote: firstQuote },
      { priority: 'medium', reason: '认可感缺失', text: '在绩效反馈中加入同级协作评价维度', dept: '产品部', mentions: 3, quote: lastQuote },
    ],
    '其他': [
      { priority: 'medium', reason: '其他', text: '扩充访谈样本并按部门切片复盘，提升归因稳定性', dept: '全部', mentions: 3, quote: firstQuote },
      { priority: 'low', reason: '其他', text: '保留匿名回访问卷，补齐离职后反馈信号', dept: '全部', mentions: 2, quote: lastQuote },
    ],
  };

  const primary = templates[topReason] || templates['其他'];
  return [
    ...primary,
    { priority: 'low', reason: '企业文化', text: '维持季度离职访谈复盘例会，追踪行动项完成率', dept: '全部', mentions: 2 },
  ];
}

function buildQuotesByReason(items: MockActionableItem[]): Record<string, MockQuoteItem[]> {
  const map: Record<string, MockQuoteItem[]> = {};
  items.forEach((item, idx) => {
    if (!map[item.reason]) map[item.reason] = [];
    if (!item.quote) return;
    map[item.reason].push({
      id: idx,
      text: item.quote,
      dept: item.dept,
      context: item.text,
    });
  });
  return map;
}

export function buildMockSessionReport(messages: ChatMessage[]): MockSessionReport {
  const userTexts = messages.filter((m) => m.role === 'user').map((m) => m.content.trim()).filter(Boolean);
  const counts = aggregateReasonCounts(userTexts);
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  const reasonDistribution = CANONICAL_REASONS
    .map((label) => {
      const count = counts[label];
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        label,
        count,
        pct,
        color: REASON_COLOR[label],
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const topCategory = reasonDistribution[0]?.label || '其他';
  const actionableItems = buildActionableItems(topCategory, userTexts);

  const avgDuration = Math.max(22, Math.min(48, 20 + messages.length));
  const retentionRiskScore = Math.min(9.3, 6.5 + (reasonDistribution[0]?.count || 1) * 0.5);

  return {
    generatedAt: new Date().toISOString(),
    source: 'session-mock',
    summary: {
      totalInterviews: 1,
      completionRate: 100,
      avgDuration,
      avgInsightsPerSession: actionableItems.length,
      retentionRiskScore: Math.round(retentionRiskScore * 10) / 10,
      topCategory,
    },
    reasonDistribution,
    actionableItems,
    quotesByReason: buildQuotesByReason(actionableItems),
  };
}

export function saveLatestMockReport(report: MockSessionReport): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
}

export function getLatestMockReport(): MockSessionReport | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockSessionReport;
  } catch {
    return null;
  }
}

export function clearLatestMockReport(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

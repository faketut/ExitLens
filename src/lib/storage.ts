import { InterviewSession, Insight, InsightCategory, DepartmentStats, TrendData } from './types';

// In-memory storage for demo (replace with Vercel KV in production)
const sessions: Map<string, InterviewSession> = new Map();
const conversationHistories: Map<string, { role: string; content: string }[]> = new Map();

export function createSession(input: {
  department: string;
  tenure: string;
  roleLevel: string;
}): InterviewSession {
  const id = generateId();
  const session: InterviewSession = {
    id,
    department: input.department,
    tenure: input.tenure,
    roleLevel: input.roleLevel,
    currentPhase: 'warmup',
    phaseMessageCounts: {
      warmup: 0,
      surface: 0,
      deep_dive: 0,
      validation: 0,
      suggestions: 0,
      closing: 0,
    },
    extractedInsights: [],
    createdAt: new Date().toISOString(),
  };
  sessions.set(id, session);
  conversationHistories.set(id, []);
  return session;
}

export function getSession(id: string): InterviewSession | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<InterviewSession>): InterviewSession | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  const updated = { ...session, ...updates };
  sessions.set(id, updated);
  return updated;
}

export function getConversationHistory(sessionId: string): { role: string; content: string }[] {
  return conversationHistories.get(sessionId) || [];
}

export function appendToHistory(sessionId: string, message: { role: string; content: string }) {
  const history = conversationHistories.get(sessionId) || [];
  history.push(message);
  conversationHistories.set(sessionId, history);
}

export function getAllSessions(): InterviewSession[] {
  return Array.from(sessions.values());
}

// --- Mock data for dashboard demo ---

export function seedMockData() {
  if (sessions.size > 0) return; // Already seeded

  const mockSessions: InterviewSession[] = [
    {
      id: 'mock-1',
      department: '产品部',
      tenure: '2年6个月',
      roleLevel: '高级产品经理',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 3, surface: 3, deep_dive: 6, validation: 2, suggestions: 3, closing: 1 },
      extractedInsights: [
        { category: 'management', content: '直属上级缺乏有效沟通，决策不透明', severity: 'high', isActionable: true, relatedQuote: '我从来不知道老板在想什么' },
        { category: 'growth', content: '晋升通道不清晰，2年没有明确的成长反馈', severity: 'high', isActionable: true, relatedQuote: '我不知道怎样才算做得好' },
        { category: 'workload', content: '长期996导致身体出现问题', severity: 'medium', isActionable: true },
      ],
      createdAt: '2026-05-01T10:00:00Z',
      completedAt: '2026-05-01T10:45:00Z',
    },
    {
      id: 'mock-2',
      department: '技术部',
      tenure: '1年2个月',
      roleLevel: '前端开发工程师',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 2, surface: 3, deep_dive: 7, validation: 3, suggestions: 2, closing: 1 },
      extractedInsights: [
        { category: 'compensation', content: '同级别薪资低于市场水平20%', severity: 'high', isActionable: true, relatedQuote: '外面给的package差距太大了' },
        { category: 'growth', content: '技术栈老旧，担心竞争力下降', severity: 'medium', isActionable: true },
        { category: 'team_dynamics', content: '团队氛围压抑，不敢提不同意见', severity: 'medium', isActionable: true, relatedQuote: '开会的时候大家都不敢说话' },
      ],
      createdAt: '2026-05-03T14:00:00Z',
      completedAt: '2026-05-03T14:50:00Z',
    },
    {
      id: 'mock-3',
      department: '技术部',
      tenure: '3年1个月',
      roleLevel: '后端开发专家',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 3, surface: 2, deep_dive: 5, validation: 2, suggestions: 3, closing: 1 },
      extractedInsights: [
        { category: 'management', content: '管理层频繁变动，方向朝令夕改', severity: 'high', isActionable: true, relatedQuote: '一年换了三个leader' },
        { category: 'recognition', content: '核心贡献不被看到，归功于其他人', severity: 'high', isActionable: true },
        { category: 'strategy', content: '对公司战略方向失去信心', severity: 'medium', isActionable: false },
      ],
      createdAt: '2026-05-08T09:00:00Z',
      completedAt: '2026-05-08T09:40:00Z',
    },
    {
      id: 'mock-4',
      department: '设计部',
      tenure: '1年8个月',
      roleLevel: '交互设计师',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 2, surface: 3, deep_dive: 6, validation: 2, suggestions: 2, closing: 1 },
      extractedInsights: [
        { category: 'culture', content: '设计话语权低，沦为"美工"角色', severity: 'high', isActionable: true, relatedQuote: '产品说什么就是什么，设计没有发言权' },
        { category: 'growth', content: '设计体系建设无人推动', severity: 'medium', isActionable: true },
        { category: 'wlb', content: '无意义的加班文化，坐班到很晚', severity: 'medium', isActionable: true },
      ],
      createdAt: '2026-05-12T16:00:00Z',
      completedAt: '2026-05-12T16:35:00Z',
    },
    {
      id: 'mock-5',
      department: '产品部',
      tenure: '4年',
      roleLevel: '产品总监',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 3, surface: 4, deep_dive: 8, validation: 3, suggestions: 4, closing: 1 },
      extractedInsights: [
        { category: 'strategy', content: '与高层在产品方向上存在根本分歧', severity: 'high', isActionable: false, relatedQuote: '我们对用户价值的理解完全不同' },
        { category: 'management', content: '跨部门协作成本极高，内耗严重', severity: 'high', isActionable: true },
        { category: 'recognition', content: '功劳被上级截留，团队成果不被组织看见', severity: 'high', isActionable: true, relatedQuote: '我带团队做的东西，汇报时变成了别人的' },
        { category: 'culture', content: '政治氛围浓厚，简单事情复杂化', severity: 'medium', isActionable: false },
      ],
      createdAt: '2026-05-15T11:00:00Z',
      completedAt: '2026-05-15T12:00:00Z',
    },
    {
      id: 'mock-6',
      department: '运营部',
      tenure: '10个月',
      roleLevel: '运营专员',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 2, surface: 2, deep_dive: 5, validation: 2, suggestions: 2, closing: 1 },
      extractedInsights: [
        { category: 'management', content: '入职后与面试承诺的岗位内容不符', severity: 'high', isActionable: true, relatedQuote: '面试说是做用户增长，进来发现是打杂' },
        { category: 'growth', content: '没有师傅带，完全靠自己摸索', severity: 'medium', isActionable: true },
        { category: 'compensation', content: '转正后薪资未达预期', severity: 'medium', isActionable: true },
      ],
      createdAt: '2026-05-20T15:00:00Z',
      completedAt: '2026-05-20T15:30:00Z',
    },
    {
      id: 'mock-7',
      department: '技术部',
      tenure: '2年',
      roleLevel: '测试工程师',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 2, surface: 3, deep_dive: 5, validation: 2, suggestions: 3, closing: 1 },
      extractedInsights: [
        { category: 'growth', content: '测试岗天花板明显，看不到转型路径', severity: 'high', isActionable: true },
        { category: 'recognition', content: '测试永远是最后被通知的，不被尊重', severity: 'medium', isActionable: true, relatedQuote: '需求都定完了才叫我们看看能不能测' },
        { category: 'workload', content: '临上线频繁变更需求，测试压力巨大', severity: 'medium', isActionable: true },
      ],
      createdAt: '2026-05-22T10:00:00Z',
      completedAt: '2026-05-22T10:40:00Z',
    },
    {
      id: 'mock-8',
      department: '产品部',
      tenure: '1年5个月',
      roleLevel: '产品经理',
      currentPhase: 'closing',
      phaseMessageCounts: { warmup: 2, surface: 3, deep_dive: 6, validation: 2, suggestions: 3, closing: 1 },
      extractedInsights: [
        { category: 'management', content: '领导micromanage严重，没有决策空间', severity: 'high', isActionable: true, relatedQuote: '连按钮放哪里都要leader拍板' },
        { category: 'culture', content: '创新被口头鼓励但实际不被允许', severity: 'medium', isActionable: true },
        { category: 'wlb', content: '周末常被拉会，没有生活', severity: 'medium', isActionable: true },
      ],
      createdAt: '2026-05-25T14:00:00Z',
      completedAt: '2026-05-25T14:45:00Z',
    },
  ];

  mockSessions.forEach(s => sessions.set(s.id, s));
}

// --- Analytics helpers ---

export function getAggregatedInsights(): { category: InsightCategory; count: number; percentage: number }[] {
  seedMockData();
  const allInsights = getAllSessions().flatMap(s => s.extractedInsights);
  const counts: Record<string, number> = {};
  allInsights.forEach(i => {
    counts[i.category] = (counts[i.category] || 0) + 1;
  });
  const total = allInsights.length;
  return Object.entries(counts)
    .map(([category, count]) => ({
      category: category as InsightCategory,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getDepartmentStats(): DepartmentStats[] {
  seedMockData();
  const allSessions = getAllSessions().filter(s => s.completedAt);
  const deptMap: Record<string, InterviewSession[]> = {};
  allSessions.forEach(s => {
    if (!deptMap[s.department]) deptMap[s.department] = [];
    deptMap[s.department].push(s);
  });

  return Object.entries(deptMap).map(([dept, deptSessions]) => {
    const allInsights = deptSessions.flatMap(s => s.extractedInsights);
    const categoryCounts: Record<string, number> = {};
    allInsights.forEach(i => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });
    const topReasons = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({ category: category as InsightCategory, count }));

    const severityMap = { low: 1, medium: 2, high: 3 };
    const avgSeverity = allInsights.reduce((sum, i) => sum + severityMap[i.severity], 0) / allInsights.length;

    return {
      department: dept,
      totalInterviews: deptSessions.length,
      topReasons,
      avgSeverity: Math.round(avgSeverity * 10) / 10,
    };
  });
}

export function getTrendData(): TrendData[] {
  return [
    { month: '2026-01', totalExits: 3, topCategory: 'compensation' },
    { month: '2026-02', totalExits: 5, topCategory: 'management' },
    { month: '2026-03', totalExits: 4, topCategory: 'growth' },
    { month: '2026-04', totalExits: 6, topCategory: 'management' },
    { month: '2026-05', totalExits: 8, topCategory: 'management' },
  ];
}

// --- Utilities ---

function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const CATEGORY_LABELS: Record<InsightCategory, string> = {
  management: '管理问题',
  growth: '发展空间',
  compensation: '薪酬福利',
  culture: '文化氛围',
  workload: '工作负荷',
  recognition: '认可尊重',
  team_dynamics: '团队关系',
  strategy: '公司方向',
  wlb: '工作生活平衡',
  other: '其他',
};

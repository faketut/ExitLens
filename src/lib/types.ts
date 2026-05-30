export type InterviewPhase =
  | 'warmup'      // 开场破冰
  | 'surface'     // 表层原因
  | 'deep_dive'   // 深层挖掘
  | 'validation'  // 验证确认
  | 'suggestions' // 建议收集
  | 'closing';    // 结束感谢

export interface InterviewSession {
  id: string;
  department: string;
  tenure: string;       // e.g. "2年3个月"
  roleLevel: string;    // e.g. "高级工程师"
  currentPhase: InterviewPhase;
  phaseMessageCounts: Record<InterviewPhase, number>;
  extractedInsights: Insight[];
  createdAt: string;
  completedAt?: string;
}

export interface Insight {
  category: InsightCategory;
  content: string;
  severity: 'low' | 'medium' | 'high';
  isActionable: boolean;
  relatedQuote?: string;
}

export type InsightCategory =
  | 'management'       // 管理问题
  | 'growth'           // 发展空间
  | 'compensation'     // 薪酬福利
  | 'culture'          // 文化氛围
  | 'workload'         // 工作负荷
  | 'recognition'      // 认可与尊重
  | 'team_dynamics'    // 团队关系
  | 'strategy'         // 公司方向
  | 'wlb'             // 工作生活平衡
  | 'other';           // 其他

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SessionStartInput {
  department: string;
  tenure: string;
  roleLevel: string;
}

// Dashboard types
export interface DepartmentStats {
  department: string;
  totalInterviews: number;
  topReasons: { category: InsightCategory; count: number }[];
  avgSeverity: number;
}

export interface TrendData {
  month: string;
  totalExits: number;
  topCategory: InsightCategory;
}

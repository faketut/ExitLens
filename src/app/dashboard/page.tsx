'use client';

import { useEffect, useState } from 'react';
import { InsightCategory } from '@/lib/types';

interface DashboardData {
  summary: {
    totalInterviews: number;
    avgInsightsPerSession: number;
    topCategory: InsightCategory;
    topCategoryLabel: string;
  };
  insights: { category: InsightCategory; count: number; percentage: number }[];
  departmentStats: {
    department: string;
    totalInterviews: number;
    topReasons: { category: InsightCategory; count: number }[];
    avgSeverity: number;
  }[];
  trends: { month: string; totalExits: number; topCategory: InsightCategory }[];
  actionableItems: {
    category: InsightCategory;
    categoryLabel: string;
    content: string;
    severity: string;
    relatedQuote?: string;
  }[];
  categoryLabels: Record<InsightCategory, string>;
}

const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const CATEGORY_COLORS: Record<string, string> = {
  management: 'bg-red-500',
  growth: 'bg-blue-500',
  compensation: 'bg-amber-500',
  culture: 'bg-purple-500',
  workload: 'bg-orange-500',
  recognition: 'bg-pink-500',
  team_dynamics: 'bg-cyan-500',
  strategy: 'bg-slate-500',
  wlb: 'bg-green-500',
  other: 'bg-gray-400',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insights')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  if (!data) return null;

  const maxInsightCount = Math.max(...data.insights.map(i => i.count));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">离职洞察仪表盘</h1>
            <p className="text-sm text-slate-500">基于 {data.summary.totalInterviews} 次 AI 面谈的匿名聚合分析</p>
          </div>
          <a
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← 返回首页
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">面谈总数</p>
            <p className="text-3xl font-bold text-slate-900">{data.summary.totalInterviews}</p>
            <p className="text-xs text-slate-400 mt-1">本月 +3 ↑</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">平均洞察数/次</p>
            <p className="text-3xl font-bold text-slate-900">{data.summary.avgInsightsPerSession}</p>
            <p className="text-xs text-slate-400 mt-1">深度对话，有效提取</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">首要离职因素</p>
            <p className="text-3xl font-bold text-red-600">{data.summary.topCategoryLabel}</p>
            <p className="text-xs text-slate-400 mt-1">占比 {data.insights[0]?.percentage}%</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reason Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">离职原因分布</h2>
            <div className="space-y-3">
              {data.insights.map(item => (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-20 flex-shrink-0">
                    {data.categoryLabels[item.category]}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[item.category]} transition-all duration-500`}
                      style={{ width: `${(item.count / maxInsightCount) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-slate-700">
                      {item.count} 次 ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">部门对比</h2>
            <div className="space-y-4">
              {data.departmentStats.map(dept => (
                <div key={dept.department} className="border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{dept.totalInterviews} 次面谈</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        dept.avgSeverity >= 2.5 ? 'bg-red-100 text-red-700' :
                        dept.avgSeverity >= 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        风险 {dept.avgSeverity}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {dept.topReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
                      >
                        {data.categoryLabels[reason.category]} ×{reason.count}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">月度趋势</h2>
          <div className="flex items-end gap-4 h-40">
            {data.trends.map(t => {
              const maxExits = Math.max(...data.trends.map(x => x.totalExits));
              const height = (t.totalExits / maxExits) * 100;
              return (
                <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500">{t.totalExits}</span>
                  <div
                    className={`w-full rounded-t-md ${CATEGORY_COLORS[t.topCategory]} transition-all duration-500`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-400">{t.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <span className="text-xs text-slate-400">主因：</span>
            {data.trends.map(t => (
              <span key={t.month} className="text-xs text-slate-500">
                {t.month.slice(5)}月 → {data.categoryLabels[t.topCategory]}
              </span>
            ))}
          </div>
        </div>

        {/* Actionable Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">高优先级可执行建议</h2>
          <p className="text-sm text-slate-500 mb-4">基于高严重度 + 可改善的离职因素自动提取</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.actionableItems.slice(0, 8).map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[item.severity as keyof typeof SEVERITY_COLORS]}`}>
                    {item.categoryLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-800 mb-1">{item.content}</p>
                {item.relatedQuote && (
                  <p className="text-xs text-slate-400 italic">&ldquo;{item.relatedQuote}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Detection Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">模式预警：技术部管理问题集中</h3>
              <p className="text-sm text-amber-800">
                近 3 个月内，技术部有 3 位离职员工（不同团队）均提到&ldquo;管理层频繁变动&rdquo;和&ldquo;缺乏有效沟通&rdquo;。
                建议 HRBP 关注技术部管理层稳定性，考虑安排管理者沟通力培训。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

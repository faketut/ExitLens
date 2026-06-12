'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { MockActionableItem, MockSessionReport, getLatestMockReport } from '@/lib/mock-report';

const PRIORITY_COLORS = {
  high: 'bg-[#fff1f1] text-[#a2191f] border border-[#ffd7d9]',
  medium: 'bg-[#fff8e1] text-[#8a5d00] border border-[#ffe7a7]',
  low: 'bg-[#edf8ee] text-[#1e7d34] border border-[#b8e6c1]',
};

const PRIORITY_LABELS = { high: '高优', medium: '中优', low: '低优' };

const RISK_STYLE = {
  high: 'bg-[#fff1f1] text-[#a2191f] border border-[#ffd7d9]',
  medium: 'bg-[#fff8e1] text-[#8a5d00] border border-[#ffe7a7]',
  low: 'bg-[#edf8ee] text-[#1e7d34] border border-[#b8e6c1]',
};

const BASE_DATA = {
  summary: {
    totalInterviews: 47,
    completionRate: 89,
    avgDuration: 38,
    avgInsightsPerSession: 4.2,
    retentionRiskScore: 7.2,
    topCategory: '管理问题',
  },
  reasonDistribution: [
    { label: '管理问题', count: 28, pct: 28, color: 'bg-[#da1e28]' },
    { label: '成长空间', count: 22, pct: 22, color: 'bg-[#0f62fe]' },
    { label: '薪资待遇', count: 18, pct: 18, color: 'bg-[#f1c21b]' },
    { label: '企业文化', count: 12, pct: 12, color: 'bg-[#8a3ffc]' },
    { label: '工作压力', count: 10, pct: 10, color: 'bg-[#ff832b]' },
    { label: '认可感缺失', count: 8, pct: 8, color: 'bg-[#d12771]' },
    { label: '其他', count: 2, pct: 2, color: 'bg-[#8d8d8d]' },
  ],
  departmentBreakdown: [
    { dept: '技术部', count: 15, riskLevel: 'high' },
    { dept: '产品部', count: 14, riskLevel: 'high' },
    { dept: '设计部', count: 8, riskLevel: 'medium' },
    { dept: '运营部', count: 7, riskLevel: 'medium' },
    { dept: '销售部', count: 3, riskLevel: 'low' },
  ],
  sentimentDistribution: [
    { label: '负面', pct: 52, color: 'bg-[#da1e28]' },
    { label: '中性', pct: 31, color: 'bg-[#f1c21b]' },
    { label: '正面', pct: 17, color: 'bg-[#24a148]' },
  ],
  tenureBreakdown: [
    { range: '<1年', count: 8 },
    { range: '1-2年', count: 16 },
    { range: '2-3年', count: 13 },
    { range: '3-5年', count: 7 },
    { range: '5年+', count: 3 },
  ],
  quarterlyTrend: [
    { quarter: "Q3'25", count: 9 },
    { quarter: "Q4'25", count: 11 },
    { quarter: "Q1'26", count: 13 },
    { quarter: "Q2'26", count: 14 },
  ],
  actionableItems: [
    { priority: 'high', reason: '成长空间', text: '制定清晰的技术路线图，每季度由CTO向工程师团队讲解方向与意义', dept: '技术部', mentions: 12, quote: '我只是想知道我做的东西有没有意义。' },
    { priority: 'high', reason: '薪资待遇', text: '建立薪资透明机制，对标市场水平进行年度调薪', dept: '全部', mentions: 11, quote: '外面给的比这里多 25%，我没有理由不走。' },
    { priority: 'high', reason: '管理问题', text: '稳定管理层结构，避免一年内超过 2 次的直属领导更换', dept: '技术部', mentions: 9, quote: '领导换了三个，每次都要重新建立信任，太累了。' },
    { priority: 'medium', reason: '成长空间', text: '设立技术升级委员会，逐步替换老旧技术栈，改善工程师市场竞争力', dept: '技术部', mentions: 8, quote: '用了五年的框架，外面根本没人在用了。' },
    { priority: 'medium', reason: '成长空间', text: '为高绩效员工提供明确的晋升通道和时间线', dept: '产品部', mentions: 7, quote: '我不知道再做两年我会在哪，这很可怕。' },
    { priority: 'medium', reason: '企业文化', text: '引入OKR对齐机制，让个人目标与公司战略清晰可见', dept: '全部', mentions: 6, quote: '做了很多事，但不知道这些事对公司重不重要。' },
    { priority: 'medium', reason: '管理问题', text: '优化跨部门协作流程，减少重复沟通和决策延迟', dept: '运营部', mentions: 5, quote: '每次跨部门推进都像在拉扯，责任边界很模糊。' },
    { priority: 'low', reason: '成长空间', text: '定期举办技术分享会和外部学习资源补贴，提升工程师接触新技术的机会', dept: '技术部', mentions: 4 },
    { priority: 'low', reason: '认可感缺失', text: '完善员工认可体系，增加 peer recognition 渠道', dept: '全部', mentions: 3, quote: '很多关键工作做了也没人知道。' },
    { priority: 'low', reason: '企业文化', text: '改善远程/混合办公政策，提高工作灵活性', dept: '全部', mentions: 3 },
  ] as MockActionableItem[],
};

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function toMarkdown(report: MockSessionReport | null, fallbackItems: MockActionableItem[]): string {
  if (!report) {
    const items = fallbackItems
      .slice(0, 5)
      .map((item) => `- [${item.priority}] ${item.text}（${item.dept}，${item.mentions}次提及）`)
      .join('\n');

    return [
      '# ExitLens 高管月报（Mock Baseline）',
      '',
      '- 数据来源：系统静态基线',
      `- 生成时间：${new Date().toISOString()}`,
      '',
      '## 优先行动项',
      items,
      '',
    ].join('\n');
  }

  const reasonRows = report.reasonDistribution
    .map((item) => `| ${item.label} | ${item.count} | ${item.pct}% |`)
    .join('\n');

  const actions = report.actionableItems
    .map((item) => `- [${item.priority}] ${item.text}（${item.dept}，${item.mentions}次提及）`)
    .join('\n');

  return [
    '# ExitLens 高管月报（本次会话 Mock）',
    '',
    `- 生成时间：${report.generatedAt}`,
    `- 首要离职因素：${report.summary.topCategory}`,
    `- 留存风险分：${report.summary.retentionRiskScore}/10`,
    '',
    '## 原因分布',
    '| 类别 | 次数 | 占比 |',
    '| --- | --- | --- |',
    reasonRows,
    '',
    '## 优先行动项',
    actions,
    '',
  ].join('\n');
}

export default function DashboardPage() {
  const [latestReport, setLatestReport] = useState<MockSessionReport | null>(null);
  const [selectedReason, setSelectedReason] = useState(BASE_DATA.reasonDistribution[0].label);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLatestReport(getLatestMockReport());
  }, []);

  const summary = latestReport?.summary ?? BASE_DATA.summary;
  const reasonDistribution = latestReport?.reasonDistribution?.length
    ? latestReport.reasonDistribution
    : BASE_DATA.reasonDistribution;
  const actionableItems = latestReport?.actionableItems?.length
    ? latestReport.actionableItems
    : BASE_DATA.actionableItems;

  const activeReason = reasonDistribution.some((item) => item.label === selectedReason)
    ? selectedReason
    : reasonDistribution[0]?.label || '其他';

  const maxReason = Math.max(...reasonDistribution.map((r) => r.count));
  const maxDept = Math.max(...BASE_DATA.departmentBreakdown.map((d) => d.count));
  const maxTenure = Math.max(...BASE_DATA.tenureBreakdown.map((t) => t.count));
  const maxQuarter = Math.max(...BASE_DATA.quarterlyTrend.map((q) => q.count));

  const reasonQuotes = useMemo(() => {
    if (latestReport?.quotesByReason?.[activeReason]?.length) {
      return latestReport.quotesByReason[activeReason];
    }

    const matched = actionableItems.filter((item) => item.reason === activeReason && item.quote);
    if (matched.length > 0) {
      return matched.map((item, idx) => ({
        id: idx,
        text: item.quote as string,
        dept: item.dept,
        context: item.text,
      }));
    }

    return [
      {
        id: 0,
        text: '该类别暂无代表性原话，建议继续收集高质量访谈样本。',
        dept: '全部',
        context: '当前展示为占位提示',
      },
    ];
  }, [latestReport, activeReason, actionableItems]);

  const handleExportJson = () => {
    const payload = latestReport ?? {
      source: 'baseline-mock',
      generatedAt: new Date().toISOString(),
      summary,
      reasonDistribution,
      actionableItems,
      quotesByReason: {},
    };
    downloadFile(JSON.stringify(payload, null, 2), 'exitlens-report.json', 'application/json;charset=utf-8');
  };

  const handleExportMarkdown = () => {
    const markdown = toMarkdown(latestReport, actionableItems);
    downloadFile(markdown, 'exitlens-report.md', 'text/markdown;charset=utf-8');
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#161616]">
      <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">离职洞察仪表盘</h1>
            <p className="text-sm text-[#525252]" suppressHydrationWarning>
              {latestReport ? '当前展示：本次会话生成的本地 mock 洞察' : `基于 ${summary.totalInterviews} 次 AI 面谈的匿名聚合分析`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="text-xs border border-[#e0e0e0] px-2.5 py-1 hover:bg-[#f4f4f4]"
            >
              导出 Markdown
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="text-xs border border-[#e0e0e0] px-2.5 py-1 hover:bg-[#f4f4f4]"
            >
              导出 JSON
            </button>
            <Link href="/" className="text-sm text-[#0f62fe] hover:underline font-medium">返回首页</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-[#e0e0e0] p-5">
            <p className="text-xs text-[#525252] mb-1">面谈总数</p>
            <p className="text-3xl font-semibold">{summary.totalInterviews}</p>
            <p className="text-xs text-[#8d8d8d] mt-1">静态 mock 数据</p>
          </div>
          <div className="bg-white border border-[#e0e0e0] p-5">
            <p className="text-xs text-[#525252] mb-1">完成率</p>
            <p className="text-3xl font-semibold">{summary.completionRate}%</p>
            <p className="text-xs text-[#8d8d8d] mt-1">流程闭环率</p>
          </div>
          <div className="bg-white border border-[#e0e0e0] p-5">
            <p className="text-xs text-[#525252] mb-1">平均时长</p>
            <p className="text-3xl font-semibold">{summary.avgDuration}<span className="text-lg font-normal text-[#525252]">分钟</span></p>
            <p className="text-xs text-[#8d8d8d] mt-1">深度对话</p>
          </div>
          <div className="bg-white border border-[#e0e0e0] p-5">
            <p className="text-xs text-[#525252] mb-1">平均洞察/次</p>
            <p className="text-3xl font-semibold">{summary.avgInsightsPerSession}</p>
            <p className="text-xs text-[#8d8d8d] mt-1">有效提取</p>
          </div>
          <div className="bg-white border border-[#e0e0e0] p-5">
            <p className="text-xs text-[#525252] mb-1">留存风险分</p>
            <p className="text-3xl font-semibold text-[#a2191f]">{summary.retentionRiskScore}<span className="text-lg font-normal text-[#8d8d8d]">/10</span></p>
            <p className="text-xs text-[#8d8d8d] mt-1">风险热度</p>
          </div>
          <div className="bg-white border border-[#e0e0e0] p-5">
            <p className="text-xs text-[#525252] mb-1">首要离职因素</p>
            <p className="text-2xl font-semibold text-[#a2191f]">{summary.topCategory}</p>
            <p className="text-xs text-[#8d8d8d] mt-1">按本次样本计算</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e0e0e0] p-6">
            <h2 className="text-base font-semibold mb-4">离职原因分布（可下钻）</h2>
            <div className="space-y-3">
              {reasonDistribution.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedReason(item.label)}
                  className={`w-full flex items-center gap-3 border px-3 py-2 transition-colors cursor-pointer ${item.label === selectedReason ? 'border-[#0f62fe] bg-[#edf5ff]' : 'border-transparent hover:border-[#e0e0e0] hover:bg-[#f8f8f8]'}`}
                >
                  <span className="text-sm text-[#525252] w-20 flex-shrink-0 text-left">{item.label}</span>
                  <div className="flex-1 bg-[#e0e0e0] h-6 relative overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${(item.count / maxReason) * 100}%` }} />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-[#161616]">{item.count} 次 ({item.pct}%)</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] p-6">
            <h2 className="text-base font-semibold mb-4">部门离职分布（基线）</h2>
            <div className="space-y-3">
              {BASE_DATA.departmentBreakdown.map((item) => (
                <div key={item.dept} className="flex items-center gap-3">
                  <span className="text-sm text-[#525252] w-14 flex-shrink-0">{item.dept}</span>
                  <div className="flex-1 bg-[#e0e0e0] h-6 relative overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${item.riskLevel === 'high' ? 'bg-[#da1e28]' : item.riskLevel === 'medium' ? 'bg-[#f1c21b]' : 'bg-[#24a148]'}`}
                      style={{ width: `${(item.count / maxDept) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-[#161616]">{item.count} 人</span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 flex-shrink-0 ${item.riskLevel === 'high' ? RISK_STYLE.high : item.riskLevel === 'medium' ? RISK_STYLE.medium : RISK_STYLE.low}`}>
                    {item.riskLevel === 'high' ? '高危' : item.riskLevel === 'medium' ? '关注' : '稳定'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e0e0e0] p-6">
            <h2 className="text-base font-semibold mb-4">对话情绪分布（基线）</h2>
            <div className="flex overflow-hidden h-8 mb-3 border border-[#e0e0e0]">
              {BASE_DATA.sentimentDistribution.map((item) => (
                <div key={item.label} className={`${item.color} flex items-center justify-center text-white text-xs font-medium transition-all`} style={{ width: `${item.pct}%` }}>
                  {item.pct >= 15 ? `${item.pct}%` : ''}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2">
              {BASE_DATA.sentimentDistribution.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 ${item.color}`} />
                  <span className="text-xs text-[#525252]">{item.label} {item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] p-6">
            <h2 className="text-base font-semibold mb-4">在职时长分布（基线）</h2>
            <div className="space-y-2">
              {BASE_DATA.tenureBreakdown.map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className="text-xs text-[#525252] w-12 flex-shrink-0">{item.range}</span>
                  <div className="flex-1 bg-[#e0e0e0] h-6 relative overflow-hidden">
                    <div
                      className="h-full bg-[#0f62fe] transition-all duration-500"
                      style={{ width: `${(item.count / maxTenure) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-[#161616]">{item.count} 人</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#8d8d8d] mt-2">1-2年工龄离职最集中，占比 34%</p>
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">季度离职趋势（基线）</h2>
            <span className="text-xs bg-[#fff1f1] text-[#a2191f] border border-[#ffd7d9] px-2 py-1">持续上升 ↑</span>
          </div>
          <div className="flex items-end gap-6 h-40">
            {BASE_DATA.quarterlyTrend.map((item) => (
              <div key={item.quarter} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-[#525252]">{item.count}</span>
                <div className="w-full bg-[#0f62fe] transition-all duration-500" style={{ height: `${(item.count / maxQuarter) * 100}%` }} />
                <span className="text-sm text-[#525252]">{item.quarter}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8d8d8d] mt-3">环比增速 Q3→Q4: +22% · Q4→Q1: +18% · Q1→Q2: +8%，增速趋缓但绝对值仍在上升</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e0e0e0] p-6">
            <h2 className="text-base font-semibold mb-1">可执行改善建议</h2>
            <p className="text-sm text-[#525252] mb-4">{latestReport ? '来自本次会话生成的 mock 洞察' : '按提及频次排序，基于系统基线数据'}</p>
            <div className="grid grid-cols-1 gap-3 max-h-[540px] overflow-y-auto pr-1">
              {actionableItems.map((item, idx) => (
                <div key={idx} className="border border-[#e0e0e0] p-4 hover:bg-[#f8f8f8] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 font-medium ${PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS]}`}>
                      {PRIORITY_LABELS[item.priority as keyof typeof PRIORITY_LABELS]}
                    </span>
                    <span className="text-xs text-[#8d8d8d]">{item.dept}</span>
                    <span className="ml-auto text-xs text-[#8d8d8d]">{item.mentions} 次提及</span>
                  </div>
                  <p className="text-sm mb-1">{item.text}</p>
                  {item.quote && <p className="text-xs text-[#6f6f6f] italic mt-2">&ldquo;{item.quote}&rdquo;</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] p-6">
            <h2 className="text-base font-semibold mb-1">原话下钻：{activeReason}</h2>
            <p className="text-sm text-[#525252] mb-4">点击上方离职原因分布任一类目，可查看该类目匿名原话与改进上下文</p>
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {reasonQuotes.map((item) => (
                <div key={item.id} className="border-l-2 border-[#0f62fe] bg-[#f8fbff] p-4">
                  <p className="text-sm mb-2">&ldquo;{item.text}&rdquo;</p>
                  <p className="text-xs text-[#6f6f6f]">部门：{item.dept}</p>
                  <p className="text-xs text-[#6f6f6f] mt-1">上下文：{item.context}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

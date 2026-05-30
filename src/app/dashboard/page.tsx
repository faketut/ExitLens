'use client';

const PRIORITY_COLORS = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-green-100 text-green-700',
};

const PRIORITY_LABELS = { high: '高优', medium: '中优', low: '低优' };

const DATA = {
  summary: {
    totalInterviews: 47,
    completionRate: 89,
    avgDuration: 38,
    avgInsightsPerSession: 4.2,
    retentionRiskScore: 7.2,
    topCategory: '管理问题',
  },
  reasonDistribution: [
    { label: '管理问题',   count: 28, pct: 28, color: 'bg-red-500' },
    { label: '成长空间',   count: 22, pct: 22, color: 'bg-blue-500' },
    { label: '薪资待遇',   count: 18, pct: 18, color: 'bg-amber-500' },
    { label: '企业文化',   count: 12, pct: 12, color: 'bg-purple-500' },
    { label: '工作压力',   count: 10, pct: 10, color: 'bg-orange-500' },
    { label: '认可感缺失', count:  8, pct:  8, color: 'bg-pink-500' },
    { label: '其他',       count:  2, pct:  2, color: 'bg-gray-400' },
  ],
  departmentBreakdown: [
    { dept: '技术部', count: 15, riskLevel: 'high' },
    { dept: '产品部', count: 14, riskLevel: 'high' },
    { dept: '设计部', count:  8, riskLevel: 'medium' },
    { dept: '运营部', count:  7, riskLevel: 'medium' },
    { dept: '销售部', count:  3, riskLevel: 'low' },
  ],
  sentimentDistribution: [
    { label: '负面', pct: 52, color: 'bg-red-400' },
    { label: '中性', pct: 31, color: 'bg-yellow-400' },
    { label: '正面', pct: 17, color: 'bg-green-400' },
  ],
  tenureBreakdown: [
    { range: '<1年',  count:  8 },
    { range: '1-2年', count: 16 },
    { range: '2-3年', count: 13 },
    { range: '3-5年', count:  7 },
    { range: '5年+',  count:  3 },
  ],
  quarterlyTrend: [
    { quarter: "Q3'25", count:  9 },
    { quarter: "Q4'25", count: 11 },
    { quarter: "Q1'26", count: 13 },
    { quarter: "Q2'26", count: 14 },
  ],
  actionableItems: [
    { priority: 'high',   text: '制定清晰的技术路线图，每季度由CTO向工程师团队讲解方向与意义',       dept: '技术部', mentions: 12, quote: '我只是想知道我做的东西有没有意义。' },
    { priority: 'high',   text: '建立薪资透明机制，对标市场水平进行年度调薪',                       dept: '全部',   mentions: 11, quote: '外面给的比这里多 25%，我没有理由不走。' },
    { priority: 'high',   text: '稳定管理层结构，避免一年内超过 2 次的直属领导更换',               dept: '技术部', mentions:  9, quote: '领导换了三个，每次都要重新建立信任，太累了。' },
    { priority: 'medium', text: '设立技术升级委员会，逐步替换老旧技术栈，改善工程师市场竞争力',    dept: '技术部', mentions:  8, quote: '用了五年的框架，外面根本没人在用了。' },
    { priority: 'medium', text: '为高绩效员工提供明确的晋升通道和时间线',                           dept: '产品部', mentions:  7, quote: '我不知道再做两年我会在哪，这很可怕。' },
    { priority: 'medium', text: '引入OKR对齐机制，让个人目标与公司战略清晰可见',                   dept: '全部',   mentions:  6, quote: '做了很多事，但不知道这些事对公司重不重要。' },
    { priority: 'medium', text: '优化跨部门协作流程，减少重复沟通和决策延迟',                       dept: '运营部', mentions:  5 },
    { priority: 'low',    text: '定期举办技术分享会和外部学习资源补贴，提升工程师接触新技术的机会', dept: '技术部', mentions:  4 },
    { priority: 'low',    text: '完善员工认可体系，增加 peer recognition 渠道',                     dept: '全部',   mentions:  3 },
    { priority: 'low',    text: '改善远程/混合办公政策，提高工作灵活性',                             dept: '全部',   mentions:  3 },
  ],
};

export default function DashboardPage() {
  const maxReason = Math.max(...DATA.reasonDistribution.map(r => r.count));
  const maxDept   = Math.max(...DATA.departmentBreakdown.map(d => d.count));
  const maxTenure = Math.max(...DATA.tenureBreakdown.map(t => t.count));
  const maxQuarter = Math.max(...DATA.quarterlyTrend.map(q => q.count));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">离职洞察仪表盘</h1>
            <p className="text-sm text-slate-500">基于 {DATA.summary.totalInterviews} 次 AI 面谈的匿名聚合分析</p>
          </div>
          <a href="/" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">← 返回首页</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* KPI Cards — 6 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 mb-1">面谈总数</p>
            <p className="text-3xl font-bold text-slate-900">{DATA.summary.totalInterviews}</p>
            <p className="text-xs text-slate-400 mt-1">本季 +14 ↑</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 mb-1">完成率</p>
            <p className="text-3xl font-bold text-slate-900">{DATA.summary.completionRate}%</p>
            <p className="text-xs text-slate-400 mt-1">行业均值 72%</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 mb-1">平均时长</p>
            <p className="text-3xl font-bold text-slate-900">{DATA.summary.avgDuration}<span className="text-lg font-normal text-slate-500">分钟</span></p>
            <p className="text-xs text-slate-400 mt-1">深度对话</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 mb-1">平均洞察/次</p>
            <p className="text-3xl font-bold text-slate-900">{DATA.summary.avgInsightsPerSession}</p>
            <p className="text-xs text-slate-400 mt-1">有效提取</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 mb-1">留存风险分</p>
            <p className="text-3xl font-bold text-red-600">{DATA.summary.retentionRiskScore}<span className="text-lg font-normal text-slate-400">/10</span></p>
            <p className="text-xs text-slate-400 mt-1">较上季 +0.8 ↑</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 mb-1">首要离职因素</p>
            <p className="text-2xl font-bold text-red-600">{DATA.summary.topCategory}</p>
            <p className="text-xs text-slate-400 mt-1">占比 28%</p>
          </div>
        </div>

        {/* Two-column: Reason + Department */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reason Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">离职原因分布</h2>
            <div className="space-y-3">
              {DATA.reasonDistribution.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-20 flex-shrink-0">{item.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${(item.count / maxReason) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-slate-700">
                      {item.count} 次 ({item.pct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">部门离职分布</h2>
            <div className="space-y-3">
              {DATA.departmentBreakdown.map(item => (
                <div key={item.dept} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-14 flex-shrink-0">{item.dept}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.riskLevel === 'high' ? 'bg-red-500' :
                        item.riskLevel === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${(item.count / maxDept) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-slate-700">
                      {item.count} 人
                    </span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                    item.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                    item.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.riskLevel === 'high' ? '高危' : item.riskLevel === 'medium' ? '关注' : '稳定'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment + Tenure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">对话情绪分布</h2>
            <div className="flex rounded-full overflow-hidden h-8 mb-3">
              {DATA.sentimentDistribution.map(item => (
                <div
                  key={item.label}
                  className={`${item.color} flex items-center justify-center text-white text-xs font-medium transition-all`}
                  style={{ width: `${item.pct}%` }}
                >
                  {item.pct >= 15 ? `${item.pct}%` : ''}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2">
              {DATA.sentimentDistribution.map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-600">{item.label} {item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tenure Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">在职时长分布</h2>
            <div className="flex items-end gap-3 h-24">
              {DATA.tenureBreakdown.map(item => (
                <div key={item.range} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500">{item.count}</span>
                  <div
                    className="w-full bg-indigo-400 rounded-t-md transition-all duration-500"
                    style={{ height: `${(item.count / maxTenure) * 100}%` }}
                  />
                  <span className="text-xs text-slate-400 text-center">{item.range}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">1-2年工龄离职最集中，占比 34%</p>
          </div>
        </div>

        {/* Quarterly Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">季度离职趋势</h2>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">持续上升 ↑</span>
          </div>
          <div className="flex items-end gap-6 h-40">
            {DATA.quarterlyTrend.map(item => (
              <div key={item.quarter} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-slate-600">{item.count}</span>
                <div
                  className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 relative group"
                  style={{ height: `${(item.count / maxQuarter) * 100}%` }}
                />
                <span className="text-sm text-slate-500">{item.quarter}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">环比增速 Q3→Q4: +22% · Q4→Q1: +18% · Q1→Q2: +8%，增速趋缓但绝对值仍在上升</p>
        </div>

        {/* Actionable Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">可执行改善建议</h2>
          <p className="text-sm text-slate-500 mb-4">按提及频次排序，基于真实对话内容提取</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DATA.actionableItems.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS]}`}>
                    {PRIORITY_LABELS[item.priority as keyof typeof PRIORITY_LABELS]}
                  </span>
                  <span className="text-xs text-slate-400">{item.dept}</span>
                  <span className="ml-auto text-xs text-slate-400">{item.mentions} 次提及</span>
                </div>
                <p className="text-sm text-slate-800 mb-1">{item.text}</p>
                {item.quote && (
                  <p className="text-xs text-slate-400 italic mt-2">&ldquo;{item.quote}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">模式预警：技术部 & 产品部留存危机</h3>
              <p className="text-sm text-amber-800">
                过去 2 个季度离职率上升 55%，技术部和产品部合计占 62% 的离职人员。这两个部门的核心诉求高度重叠：
                管理层稳定性不足 + 技术成长空间受限。建议优先启动针对这两个部门的专项留存计划，
                重点动作：稳定直属领导配置、发布技术路线图、对标外部薪资。
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

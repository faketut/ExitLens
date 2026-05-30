import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 text-white">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">知</span>
          </div>
          <span className="font-semibold text-lg">ExitLens</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
            数据洞察
          </Link>
          <Link
            href="/interview"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
          >
            开始面谈
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI 驱动的离职面谈新范式
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          听见<span className="text-indigo-400">真实</span>的离职原因
          <br />
          <span className="text-slate-300">而不只是客套话</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          传统离职面谈中，70% 的反馈被&ldquo;美化&rdquo;。ExitLens 利用 AI 的独特优势 ——
          <span className="text-slate-200"> 没有权力关系、没有评判、没有面子压力</span> ——
          让离职员工愿意说出真话。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/interview"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-indigo-500/30"
          >
            体验 AI 面谈 →
          </Link>
          <Link
            href="/dashboard"
            className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            查看洞察示例
          </Link>
        </div>
      </section>

      {/* Why AI is better */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">为什么 AI 面谈比人更好？</h2>
          <p className="text-slate-400">这可能是少数 AI &ldquo;不是人&rdquo; 反而成为优势的场景</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">零权力关系</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              传统面谈者是 HR（体制内的人）。员工顾虑推荐信、人际关系，倾向美化回答。AI 没有这些利害关系。
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎭</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">无面子压力</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              在中国职场文化中，&ldquo;面子&rdquo;让人难以当面表达不满。面对 AI，这层社交压力消失了。
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">专业追问技术</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              运用动机访谈(MI)技术，识别客套话并温和追问。不带预设，不做评判，只是好奇。
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">六阶段渐进式面谈</h2>
          <p className="text-slate-400">像一位善解人意的朋友，由浅入深</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '👋', name: '破冰', desc: '建立信任' },
            { icon: '💭', name: '表层', desc: '收集原因' },
            { icon: '🔬', name: '深挖', desc: '探索真因' },
            { icon: '✅', name: '验证', desc: '确认理解' },
            { icon: '💡', name: '建议', desc: '收集改善' },
            { icon: '🤝', name: '结束', desc: '温暖告别' },
          ].map((phase, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-2xl">{phase.icon}</span>
              <p className="font-medium text-sm mt-2">{phase.name}</p>
              <p className="text-xs text-slate-500 mt-1">{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value for HR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">HR 获得什么？</h2>
              <ul className="space-y-3">
                {[
                  '匿名聚合的真实离职原因，而非美化后的数据',
                  '跨团队模式检测："3人都提到管理沟通问题"',
                  '可执行的改善建议，按严重程度排序',
                  '月度趋势追踪，发现恶化信号',
                  '减轻 HRBP 重复性面谈负担',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="inline-block bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                <p className="text-4xl font-bold text-indigo-400 mb-1">3.2x</p>
                <p className="text-sm text-slate-400">相比传统面谈</p>
                <p className="text-sm text-slate-400">提取更多深层洞察</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-4">准备听到真话了吗？</h2>
        <p className="text-slate-400 mb-8">每一个离开的人都带走了一个未被听见的故事</p>
        <Link
          href="/interview"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-10 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-indigo-500/30"
        >
          立即体验 Demo →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">ExitLens · AI 离职真因挖掘器</p>
          <p className="text-sm text-slate-500">AI-HR 培训生赛道作品 · 2026</p>
        </div>
      </footer>
    </div>
  );
}

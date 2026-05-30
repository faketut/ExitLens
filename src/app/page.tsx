import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#161616]">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="border-b border-[#e0e0e0] sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" fill="#0f62fe"/>
              <path d="M6 5h8M6 10h8M6 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-sm tracking-wide">ExitLens</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-[#525252]">
            <Link href="#why" className="hover:text-[#161616] transition-colors">产品特点</Link>
            <Link href="#how" className="hover:text-[#161616] transition-colors">工作方式</Link>
            <Link href="/dashboard" className="hover:text-[#161616] transition-colors">洞察示例</Link>
          </div>
          <Link
            href="/interview"
            className="text-sm bg-[#0f62fe] hover:bg-[#0353e9] text-white px-4 py-2 transition-colors"
          >
            开始体验
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-white pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <p className="text-[#0f62fe] text-sm font-medium mb-6 tracking-wide uppercase">AI 驱动的员工洞察</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.06] tracking-tight text-[#161616] mb-8">
              听见员工<br/>
              <span className="font-semibold">真实的声音</span>
            </h1>
            <p className="text-xl text-[#525252] max-w-2xl leading-relaxed mb-10">
              传统离职面谈中，70% 的反馈被美化。ExitLens 利用 AI 消除权力压力，
              让每位离职员工都愿意说出真实原因，为 HR 提供可执行的改善洞察。
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 bg-[#0f62fe] hover:bg-[#0353e9] text-white text-base px-6 py-3 transition-colors"
              >
                体验 AI 面谈
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 border border-[#8d8d8d] text-[#161616] hover:bg-[#f4f4f4] text-base px-6 py-3 transition-colors"
              >
                查看洞察示例
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ──────────────────────────────────────────────── */}
      <section className="bg-[#161616] py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '70%', label: '传统面谈的反馈被刻意美化' },
            { value: '3.2×', label: '相比人工面谈提取更多深层洞察' },
            { value: '38分钟', label: '平均对话时长，覆盖6个探索阶段' },
            { value: '89%', label: '面谈完成率，远高于行业均值72%' },
          ].map((stat, i) => (
            <div key={i} className="border-l-2 border-[#0f62fe] pl-6">
              <p className="text-4xl font-light text-white mb-2">{stat.value}</p>
              <p className="text-sm text-[#a8a8a8] leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why AI ──────────────────────────────────────────────────── */}
      <section id="why" className="py-24 px-6 bg-[#f4f4f4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[#0f62fe] text-sm font-medium mb-3 tracking-wide uppercase">产品特点</p>
            <h2 className="text-4xl font-light text-[#161616] max-w-xl leading-tight">
              为什么 AI 面谈<br/><span className="font-semibold">比人更有效？</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0]">
            {[
              {
                tag: '01',
                title: '零权力关系',
                body: '传统面谈者是 HR——体制内的人。员工顾虑推荐信与人际关系，倾向美化回答。AI 没有这些利害关系，员工可以完全放开。',
              },
              {
                tag: '02',
                title: '消除面子压力',
                body: '在中国职场文化中，"面子"让人难以当面表达不满。面对 AI，这层社交顾虑完全消失，员工更愿意直接表达真实想法。',
              },
              {
                tag: '03',
                title: '动机访谈技术',
                body: '运用 MI（Motivational Interviewing）技术，识别客套话并温和追问。由浅入深，不带预设，不做评判，引导员工自行深挖原因。',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 group hover:bg-[#0f62fe] transition-colors duration-300">
                <p className="text-[#0f62fe] group-hover:text-white/60 text-sm font-mono mb-6 transition-colors">{item.tag}</p>
                <h3 className="text-xl font-semibold text-[#161616] group-hover:text-white mb-4 transition-colors">{item.title}</h3>
                <p className="text-sm text-[#525252] group-hover:text-white/80 leading-relaxed transition-colors">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[#0f62fe] text-sm font-medium mb-3 tracking-wide uppercase">工作方式</p>
              <h2 className="text-4xl font-light text-[#161616] leading-tight mb-6">
                六阶段<br/><span className="font-semibold">渐进式探索</span>
              </h2>
              <p className="text-[#525252] leading-relaxed mb-8">
                像一位善解人意的朋友，由轻松的破冰话题逐步深入，
                在建立充分信任后才触碰敏感核心问题，确保员工全程愿意开口。
              </p>
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 text-[#0f62fe] text-sm font-medium hover:underline"
              >
                立即体验完整流程
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="space-y-0 border border-[#e0e0e0]">
              {[
                { num: '01', phase: '开场破冰', desc: '建立信任，说明匿名与无评判原则，营造安全感' },
                { num: '02', phase: '收集表层原因', desc: '开放式提问，记录员工主动提及的离职理由' },
                { num: '03', phase: '深层挖掘', desc: '动机访谈技术识别美化话术，温和追问背后真因' },
                { num: '04', phase: '验证确认', desc: '反映理解，请员工确认 AI 的概括是否准确' },
                { num: '05', phase: '收集改善建议', desc: '询问若公司改变一件事，员工最希望是什么' },
                { num: '06', phase: '温暖告别', desc: '感谢分享，说明反馈将匿名汇入组织改善' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-5 border-b border-[#e0e0e0] last:border-0 hover:bg-[#f4f4f4] transition-colors">
                  <span className="text-[#0f62fe] text-xs font-mono mt-0.5 flex-shrink-0">{step.num}</span>
                  <div>
                    <p className="font-medium text-sm text-[#161616] mb-0.5">{step.phase}</p>
                    <p className="text-xs text-[#525252] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HR value ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f4f4f4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[#0f62fe] text-sm font-medium mb-3 tracking-wide uppercase">HR 获得什么</p>
            <h2 className="text-4xl font-light text-[#161616] max-w-xl leading-tight">
              从对话到<span className="font-semibold">可执行洞察</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0]">
            {[
              { icon: '📊', title: '真实原因分布', body: '匿名聚合后的离职原因占比，而非员工告知 HR 的礼貌版本' },
              { icon: '🔍', title: '跨团队模式检测', body: '自动识别"3人都提到管理沟通问题"等跨团队共性信号' },
              { icon: '⚡', title: '可执行建议', body: '按严重程度排序的改善建议，直接对应 HRBP 可落地的行动' },
              { icon: '📈', title: '月度趋势追踪', body: '发现特定部门或时间段的离职恶化信号，提前预警' },
              { icon: '⏱', title: '节省 HRBP 时间', body: '自动完成重复性面谈，HRBP 只需关注高风险案例的深度跟进' },
              { icon: '🔒', title: '员工信任保障', body: '全程匿名，员工知道结果只以聚合形式呈现，愿意说真话' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8">
                <div className="text-2xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#161616] mb-2">{item.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────────────── */}
      <section className="bg-[#0f62fe] py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-white leading-tight mb-3">
              准备听到<span className="font-semibold">真话</span>了吗？
            </h2>
            <p className="text-[#a6c8ff] text-base">
              每一个离开的人，都带走了一个未被听见的故事
            </p>
          </div>
          <div className="flex flex-wrap gap-4 flex-shrink-0">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 bg-white text-[#0f62fe] hover:bg-[#f4f4f4] font-medium px-6 py-3 transition-colors"
            >
              立即体验 Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-medium px-6 py-3 transition-colors"
            >
              查看洞察仪表盘
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#161616] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-[#393939]">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" fill="#0f62fe"/>
                <path d="M6 5h8M6 10h8M6 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-semibold text-sm text-white tracking-wide">ExitLens</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-[#a8a8a8]">
              <Link href="/interview" className="hover:text-white transition-colors">体验面谈</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">洞察仪表盘</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6f6f6f]">
            <p>© 2026 ExitLens · AI 离职真因挖掘器</p>
            <p>AI-HR 培训生赛道作品 · 数据完全匿名聚合</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

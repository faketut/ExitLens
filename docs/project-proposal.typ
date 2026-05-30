#set text(font: ("Noto Sans CJK SC", "PingFang SC", "Heiti SC", "Source Han Sans SC"), size: 10.5pt)
#set page(margin: (x: 2.5cm, y: 2cm))
#set par(justify: true, leading: 0.8em)
#set heading(numbering: "1.")

#align(center)[
  #text(size: 16pt, weight: "bold")[ExitLens · AI 离职真因挖掘器]
  #v(0.3em)
  #text(size: 11pt, fill: gray)[项目方案说明]
  #v(0.3em)
  #text(size: 9pt, fill: gray)[2026.05.30 | AI-HR 培训生自由赛道]
]

#v(1em)

= 问题诊断

传统离职面谈存在三大痛点：①权力不对等——HR 与员工的上下级关系导致员工自我审查；②面子压力——面对面场景中员工倾向给出"社会期望答案"；③数据碎片化——面谈结果以非结构化文本存档，难以横向对比和趋势分析。结果是 HR 获取的离职原因失真率高，组织无法根据真实数据做出保留策略调整。

= 方案设计

ExitLens 采用 *匿名 AI 对话* 替代传统面谈，设计六阶段渐进式对话状态机（暖场→表层原因→深层挖掘→验证确认→建议收集→温暖告别），每阶段运用动机访谈（MI）技术，通过开放式提问、反映性倾听和肯定语言降低防御心理，逐步挖掘深层原因。对话完成后自动聚合为结构化洞察，在 HR 仪表盘中以部门、任期、职级等维度呈现趋势。

*当前为演示版本*：对话内容采用预设剧本（11条 AI 消息覆盖6个阶段），并内置10条预填充用户回复，演示者无需实际输入即可完整体验全流程。仪表盘采用高保真模拟数据（47次面谈、5个部门、10条可执行建议），直观展示产品最终形态。

= AI 工具选型理由

#table(
  columns: (1fr, 2fr),
  stroke: 0.5pt,
  [*组件*], [*选型及理由*],
  [LLM], [多模型 fallback：DeepSeek → Gemini（成本低、中文强；Gemini 作为备选保障可用性）],
  [SDK], [Vercel AI SDK v6（统一接口适配 OpenAI/Anthropic/Google/兼容模型，流式输出开箱即用）],
  [框架], [Next.js 16 App Router（全栈一体，SSR + API Route + 流式 Response）],
  [部署], [腾讯 CloudBase 云托管（Dockerfile 容器化，自动伸缩，国内网络低延迟）],
)

= 关键配置

- *多模型 fallback*：`providers.ts` 按 `OPENAI → ANTHROPIC → DEEPSEEK → GEMINI` 优先级注册；`streamTextWithFallback()` 在主模型抛错时自动切换到下一个可用模型。
- *流式错误透传*：废弃 `toTextStreamResponse()`（静默吞错），改用 `fullStream` 迭代手动构建 `ReadableStream`，将 AI 错误实时推送至前端 `[AI错误: ...]`。
- *六阶段状态机*：基于消息计数自动推进对话阶段，每阶段独立 System Prompt，确保访谈节奏可控。

= 迭代记录

#table(
  columns: (auto, 1fr, 1fr),
  stroke: 0.5pt,
  [*阶段*], [*问题 / 目标*], [*解决 / 实现*],
  [v0.1], [AI 无响应（空白）], [发现 `toTextStreamResponse()` 吞错，改用 `fullStream` 手动流],
  [v0.2], [部署后 404 Not Found], [SDK 拼接 URL 为 `baseURL + /chat/completions`，补 `/v1` 路径],
  [v0.3], [CloudBase 容器无法连接外部 API], [增加 Gemini fallback + `/api/debug` 诊断端点],
  [v0.4], [Zscaler 企业代理阻断本地测试], [通过 CloudBase 云端直接验证，本地仅验证构建],
  [v0.5], [转向高保真演示：无需 API Key 可完整体验], [对话页改用预设剧本（`SCRIPT[]` 11条消息 + `simulateTyping()`）；仪表盘改用硬编码模拟数据，移除所有实时 API 调用],
  [v0.6], [演示需手动输入降低流畅度], [内置 `USER_RESPONSES[10]` 预填充回复，AI 打字完成后自动填入输入框，演示者只需按回车],
  [v0.7], [页面视觉风格缺乏专业感], [全站采用 IBM Carbon 设计系统：`#0f62fe` 蓝、`#161616` 文字、无圆角直边按钮、扁平边框；所有 emoji 图标替换为 SVG 线性图标],
)

= 效果评估

- *可用性*：多模型 fallback 机制确保单一 API 故障时服务不中断，SLA 显著提升；演示版本完全脱离 API 依赖，零故障风险。
- *真实度*：匿名 + AI 对话消除权力压力，用户无需面对真人 HR，表达意愿更高；六阶段 MI 技术脚本经过人工优化，还原真实深度访谈节奏。
- *效率*：单次面谈从 HR 30 min 人力降至 0，对话自动完成并结构化归档；演示者全程无需输入，Enter 键驱动完整体验。
- *洞察力*：仪表盘聚合多维度数据（部门/任期/职级/情绪/季度趋势），6 个 KPI 卡、7 类离职原因、10 条带原话引用的可执行建议，模拟真实产品形态。
- *视觉专业度*：全站对齐 IBM Carbon Design System，与企业级 HR 产品风格一致，提升评审可信度。

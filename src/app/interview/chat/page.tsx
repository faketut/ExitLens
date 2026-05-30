'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, Suspense } from 'react';
import { PHASE_CONFIG, PHASES_ORDER } from '@/lib/ai/state-machine';
import { InterviewPhase } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SCRIPT: { phase: InterviewPhase; text: string }[] = [
  { phase: 'warmup',      text: '你好！很高兴有机会和你交流。这次对话会完全匿名，你所分享的内容只会以聚合的形式呈现给 HR 参考，没有对错之分。\n\n我们先从轻松的话题开始——在这里的日子里，有什么是你觉得还不错的经历吗？' },
  { phase: 'warmup',      text: '谢谢你的分享，听起来你在项目和团队协作方面还是有不少收获的。那是什么让你最终决定迈出这一步呢？' },
  { phase: 'surface',     text: '嗯，我听到了。能多说说是哪些方面让你感觉到了天花板吗？是技术上的，还是职业发展路径的问题？' },
  { phase: 'surface',     text: '技术栈老旧确实会让人担心自己的市场竞争力，这很合理。除了技术层面，在你和直属上级的合作中，有没有什么让你觉得不太顺心的地方？' },
  { phase: 'deep_dive',   text: '一年内领导换了好几次，这种不确定性对团队稳定性影响很大。你觉得这背后是什么原因造成的？' },
  { phase: 'deep_dive',   text: '内部矛盾多、方向不稳——这种消耗确实很累。我再问一个可能比较敏感的问题：薪资方面，你觉得公司的竞争力如何？' },
  { phase: 'deep_dive',   text: '薪资差距如果达到 20%+ 确实很难忽视，尤其在跳槽成本这么低的市场环境下。\n\n我想再深入一点——在这里工作，有没有哪个时刻是你感觉"我的贡献没有被看见"的？' },
  { phase: 'validation',  text: '谢谢你的坦诚，这些细节对我们理解真实情况非常重要。\n\n综合来看，我理解你的主要考量是：技术成长空间受限、管理层稳定性不足、薪资低于市场水平，以及付出感与回报不匹配。这个理解准确吗？' },
  { phase: 'suggestions', text: '非常感谢你的确认。如果公司想改善这些问题，你认为优先级最高的是什么？哪怕只做一件事，你希望是什么？' },
  { phase: 'suggestions', text: '制定清晰的技术路线图——这是一个非常具体的建议，很有价值。\n\n你提到希望 CTO 层面能把技术规划讲清楚，让工程师知道方向和意义，这背后是不是也有一种"我想知道自己的工作是否有价值"的感受？' },
  { phase: 'closing',     text: '非常感谢你今天愿意花时间分享这些真实的想法。你的每一个反馈都会以完全匿名的方式汇入组织洞察，帮助公司做出有意义的改善。\n\n祝你在新的地方一切顺利，找到真正适合你的环境！🌟' },
];

function simulateTyping(text: string, onUpdate: (s: string) => void, onDone: () => void): () => void {
  let i = 0;
  const id = setInterval(() => {
    i = Math.min(i + 7, text.length);
    onUpdate(text.slice(0, i));
    if (i >= text.length) { clearInterval(id); onDone(); }
  }, 28);
  return () => clearInterval(id);
}

function ChatContent() {
  useSearchParams();

  const [scriptIdx, setScriptIdx] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('warmup');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playNextAI = (idx: number) => {
    if (idx >= SCRIPT.length) { setIsDone(true); return; }
    const entry = SCRIPT[idx];
    const msgId = crypto.randomUUID();
    setIsTyping(true);
    setCurrentPhase(entry.phase);
    setMessages(prev => [...prev, { id: msgId, role: 'assistant', content: '' }]);
    const t = setTimeout(() => {
      simulateTyping(
        entry.text,
        partial => setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: partial } : m)),
        () => {
          setIsTyping(false);
          setScriptIdx(idx + 1);
          if (idx + 1 >= SCRIPT.length) setIsDone(true);
        }
      );
    }, 600);
    return () => clearTimeout(t);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const cleanup = playNextAI(0); return cleanup; }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isDone) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: input.trim() }]);
    setInput('');
    playNextAI(scriptIdx);
    inputRef.current?.focus();
  };

  const phaseIndex = PHASES_ORDER.indexOf(currentPhase);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-sm">💬</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">小知 · AI面谈顾问</h1>
                <p className="text-xs text-slate-500">{PHASE_CONFIG[currentPhase].name}</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">匿名对话中</span>
          </div>
          <div className="flex gap-1">
            {PHASES_ORDER.map((phase, idx) => (
              <div
                key={phase}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${idx <= phaseIndex ? 'bg-indigo-500' : 'bg-slate-200'}`}
                title={PHASE_CONFIG[phase].name}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          {isDone ? (
            <div className="text-center py-2">
              <p className="text-sm text-slate-500 mb-2">对话已结束，感谢您的分享</p>
              <a href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                查看洞察报告 →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isTyping ? '小知正在输入...' : '输入你的想法，按回车发送'}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                发送
              </button>
            </form>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-slate-500">加载中...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { PHASE_CONFIG, PHASES_ORDER } from '@/lib/ai/state-machine';
import { InterviewPhase } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const department = searchParams.get('department') || '';
  const tenure = searchParams.get('tenure') || '';
  const roleLevel = searchParams.get('roleLevel') || '';

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('warmup');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToAPI = useCallback(async (body: Record<string, unknown>) => {
    setIsLoading(true);
    const assistantMsgId = `msg_${Date.now()}`;
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // Extract headers
      const newSessionId = res.headers.get('X-Session-Id');
      const phase = res.headers.get('X-Phase');
      if (newSessionId) setSessionId(newSessionId);
      if (phase) setCurrentPhase(phase as InterviewPhase);

      // Stream the response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages(prev =>
          prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m)
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev =>
        prev.map(m => m.id === assistantMsgId
          ? { ...m, content: '抱歉，连接出现问题，请稍后重试。' }
          : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize conversation
  useEffect(() => {
    if (!isInitialized && department) {
      setIsInitialized(true);
      sendToAPI({ action: 'create', department, tenure, roleLevel });
    }
  }, [isInitialized, department, tenure, roleLevel, sendToAPI]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: `msg_${Date.now()}`, role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    const message = input.trim();
    setInput('');

    await sendToAPI({ sessionId, message });
    inputRef.current?.focus();
  };

  const phaseIndex = PHASES_ORDER.indexOf(currentPhase);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
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
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              匿名对话中
            </span>
          </div>
          {/* Phase progress bar */}
          <div className="flex gap-1">
            {PHASES_ORDER.map((phase, idx) => (
              <div
                key={phase}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx <= phaseIndex ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
                title={PHASE_CONFIG[phase].name}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
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

      {/* Input */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          {currentPhase === 'closing' && messages.length > 3 && !isLoading ? (
            <div className="text-center py-2">
              <p className="text-sm text-slate-500 mb-2">对话已结束，感谢您的分享</p>
              <a
                href="/dashboard"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                查看洞察报告 →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入你的想法..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
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

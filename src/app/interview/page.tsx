'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEPARTMENTS = ['技术部', '产品部', '设计部', '运营部', '市场部', '人力资源部', '财务部', '其他'];
const TENURE_OPTIONS = ['不到6个月', '6个月-1年', '1-2年', '2-3年', '3-5年', '5年以上'];
const ROLE_LEVELS = ['实习生', '初级', '中级', '高级', '专家', '经理', '总监', '其他'];

export default function InterviewPage() {
  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [department, setDepartment] = useState('');
  const [tenure, setTenure] = useState('');
  const [roleLevel, setRoleLevel] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!department || !tenure || !roleLevel) return;
    setIsStarting(true);

    // Create session and redirect to chat
    const params = new URLSearchParams({ department, tenure, roleLevel });
    router.push(`/interview/chat?${params.toString()}`);
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Logo mark */}
          <div className="mb-10">
            <div className="w-10 h-10 flex items-center justify-center bg-[#0f62fe] mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-light text-[#161616] mb-1">离职面谈</h1>
            <p className="text-[#525252]">一次安全、匿名的对话</p>
          </div>

          {/* Feature list */}
          <div className="border border-[#e0e0e0] divide-y divide-[#e0e0e0] mb-6">
            <div className="flex items-start gap-4 p-5">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f62fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#161616] text-sm">完全匿名</p>
                <p className="text-sm text-[#525252] mt-0.5">对话内容不会关联到您的个人身份</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f62fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  <path d="M18 14l2 2 4-4" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#161616] text-sm">AI 倾听者</p>
                <p className="text-sm text-[#525252] mt-0.5">不是 HR，不代表公司，只想听听你的真实感受</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f62fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#161616] text-sm">推动改变</p>
                <p className="text-sm text-[#525252] mt-0.5">反馈会被匿名汇总，帮助改善组织问题</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#6f6f6f] mb-5">对话大约需要 10–15 分钟，您可以随时结束</p>

          <button
            onClick={() => setStep('form')}
            className="w-full bg-[#0f62fe] hover:bg-[#0353e9] text-white font-medium py-3 px-4 transition-colors text-sm"
          >
            开始对话
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-[#161616]">基本信息</h2>
          <p className="text-sm text-[#525252] mt-1">仅用于对话引导，不会关联个人身份</p>
        </div>

        <div className="border border-[#e0e0e0] p-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#525252] uppercase tracking-wide mb-2">所在部门</label>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENTS.map(d => (
                <button
                  key={d}
                  onClick={() => setDepartment(d)}
                  className={`py-2 px-3 text-sm border transition-colors ${
                    department === d
                      ? 'border-[#0f62fe] bg-[#edf5ff] text-[#0f62fe]'
                      : 'border-[#e0e0e0] hover:border-[#8d8d8d] text-[#525252]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#525252] uppercase tracking-wide mb-2">在职时长</label>
            <div className="grid grid-cols-2 gap-2">
              {TENURE_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  className={`py-2 px-3 text-sm border transition-colors ${
                    tenure === t
                      ? 'border-[#0f62fe] bg-[#edf5ff] text-[#0f62fe]'
                      : 'border-[#e0e0e0] hover:border-[#8d8d8d] text-[#525252]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#525252] uppercase tracking-wide mb-2">职级层次</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_LEVELS.map(r => (
                <button
                  key={r}
                  onClick={() => setRoleLevel(r)}
                  className={`py-2 px-3 text-sm border transition-colors ${
                    roleLevel === r
                      ? 'border-[#0f62fe] bg-[#edf5ff] text-[#0f62fe]'
                      : 'border-[#e0e0e0] hover:border-[#8d8d8d] text-[#525252]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep('intro')}
              className="flex-1 border border-[#e0e0e0] hover:bg-[#f4f4f4] text-[#525252] font-medium py-3 px-4 transition-colors text-sm"
            >
              返回
            </button>
            <button
              onClick={handleStart}
              disabled={!department || !tenure || !roleLevel || isStarting}
              className="flex-1 bg-[#0f62fe] hover:bg-[#0353e9] disabled:bg-[#c6c6c6] text-white font-medium py-3 px-4 transition-colors text-sm"
            >
              {isStarting ? '准备中...' : '进入面谈'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

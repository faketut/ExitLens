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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">离职面谈</h1>
            <p className="text-slate-600">一次安全、匿名的对话</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">🔒</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">完全匿名</p>
                  <p className="text-sm text-slate-500">对话内容不会关联到您的个人身份</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">🤖</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">AI 倾听者</p>
                  <p className="text-sm text-slate-500">我不是HR，不代表公司，只想听听你的真实感受</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">🎯</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">推动改变</p>
                  <p className="text-sm text-slate-500">你的反馈会被匿名汇总，帮助改善组织问题</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-4">
                对话大约需要 10-15 分钟，您可以随时结束
              </p>
              <button
                onClick={() => setStep('form')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                开始对话
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">基本信息</h2>
          <p className="text-sm text-slate-500 mt-1">仅用于对话引导，不会关联个人身份</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">所在部门</label>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENTS.map(d => (
                <button
                  key={d}
                  onClick={() => setDepartment(d)}
                  className={`py-2 px-3 rounded-lg text-sm border transition-colors ${
                    department === d
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">在职时长</label>
            <div className="grid grid-cols-2 gap-2">
              {TENURE_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  className={`py-2 px-3 rounded-lg text-sm border transition-colors ${
                    tenure === t
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">职级层次</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_LEVELS.map(r => (
                <button
                  key={r}
                  onClick={() => setRoleLevel(r)}
                  className={`py-2 px-3 rounded-lg text-sm border transition-colors ${
                    roleLevel === r
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
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
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              返回
            </button>
            <button
              onClick={handleStart}
              disabled={!department || !tenure || !roleLevel || isStarting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              {isStarting ? '准备中...' : '进入面谈'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

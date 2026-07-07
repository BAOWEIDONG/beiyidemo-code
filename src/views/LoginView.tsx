import { useState, useEffect } from 'react';
import { loginService, fetchClaimsService, fetchInpatientAppsService } from '../api/c_end_service';
import { Smartphone, KeyRound, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';
import { Role } from '../types';

export function LoginView() {
  const { setUser, setCurrentView, setClaims, setInpatientApps } = useAppStore();
  const [loading, setLoading] = useState<Role | null>(null);
  const [loginRole, setLoginRole] = useState<Role>('user');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementType, setAgreementType] = useState<'service' | 'privacy'>('service');

  const [error, setError] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    setError('');
    if (!phone || phone.length !== 11) {
      setError('请输入正确的11位手机号');
      return;
    }
    setCountdown(60);
  };

    const handleLogin = async () => {
    setError('');
    if (!phone || phone.length !== 11) {
      setError('请输入正确的11位手机号');
      return;
    }
    if (!code) {
      setError('请输入验证码');
      return;
    }
    if (!agreed) {
      setError('请先勾选同意《用户服务协议》及《隐私政策》');
      return;
    }

    setLoading(loginRole);
    try {
      const user = await loginService({ phone, code, loginRole });
      
      const claimsData = await fetchClaimsService(user.id);
      const inpatientAppsData = await fetchInpatientAppsService(user.id);
      setClaims(claimsData);
      setInpatientApps(inpatientAppsData);

      setUser(user);
      if (loginRole === 'user') {
        setCurrentView('home');
      } else {
        setCurrentView('reviewWorkbench');
      }
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white flex flex-col items-center justify-center p-8"
    >
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
        <ShieldCheck size={32} className="text-white" />
      </div>
      <h1 className="text-xl font-bold text-slate-800 tracking-tight mb-4">运动员医疗管理系统</h1>
      <div className="flex justify-center mb-8">
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2 rounded-full border border-blue-100/50 shadow-sm">
          {loginRole === 'user' ? '队员端登录' : loginRole === 'beiyi_admin' ? '北医管理端登录' : '保险理赔端登录'}
        </span>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Smartphone size={18} className="text-slate-400" />
          </div>
          <input
            type="tel"
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="请输入11位手机号 (测试: 13800138000)"
          />
        </div>

        <div className="relative flex space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="请输入验证码"
            />
          </div>
          <button
            onClick={handleSendCode}
            disabled={countdown > 0}
            className="bg-blue-50 text-blue-600 text-xs font-bold px-4 rounded-xl whitespace-nowrap disabled:text-slate-400 disabled:bg-slate-50 active:bg-blue-100 transition-colors"
          >
            {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
          </button>
        </div>

        <div className="flex items-start pt-2 mb-4 cursor-pointer" onClick={() => setAgreed(!agreed)}>
          <div className="mt-0.5 mr-2 text-slate-400">
            {agreed ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed flex-1 select-none">
            我已阅读并同意 <span className="text-blue-600 hover:underline" onClick={(e) => { e.stopPropagation(); setAgreementType('service'); setShowAgreement(true); }}>《用户服务协议》</span> 及 <span className="text-blue-600 hover:underline" onClick={(e) => { e.stopPropagation(); setAgreementType('privacy'); setShowAgreement(true); }}>《隐私政策》</span>
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-red-50 text-red-500 text-xs text-center font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={14} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading !== null}
          className="w-full bg-slate-900 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 active:bg-slate-800 transition-colors disabled:opacity-70 shadow-lg shadow-slate-200 mt-2"
        >
          <span>{loading ? '登录中...' : '登录'}</span>
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-4 text-xs text-slate-400">
        {loginRole !== 'user' && (
          <button onClick={() => setLoginRole('user')} className="hover:text-blue-600 transition-colors">
            返回队员登录
          </button>
        )}
        {loginRole === 'user' && (
          <>
            <button onClick={() => setLoginRole('beiyi_admin')} className="hover:text-blue-600 transition-colors">
              北医管理入口
            </button>
            <span className="text-slate-200">|</span>
            <button onClick={() => setLoginRole('insurance_admin')} className="hover:text-blue-600 transition-colors">
              保险理赔中心
            </button>
          </>
        )}
      </div>

      {showAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {agreementType === 'service' ? '用户服务协议' : '隐私政策'}
            </h3>
            <div className="flex-1 overflow-y-auto text-sm text-slate-600 space-y-4 pr-2">
              <p>这里是{agreementType === 'service' ? '用户服务协议' : '隐私政策'}的具体内容展示区域。</p>
              <p>1. 协议条款1...</p>
              <p>2. 协议条款2...</p>
              <p>3. 协议条款3...</p>
              <p>请仔细阅读以上内容。</p>
            </div>
            <button 
              onClick={() => setShowAgreement(false)}
              className="mt-6 w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

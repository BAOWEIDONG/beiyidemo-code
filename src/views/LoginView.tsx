import { useState } from 'react';
import { useAppStore } from '../store';
import { ShieldCheck, MessageCircle, Building, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { Role } from '../types';

export function LoginView() {
  const { setUser, setCurrentView } = useAppStore();
  const [loading, setLoading] = useState<Role | null>(null);

  const handleWechatLogin = (role: Role) => {
    setLoading(role);
    setTimeout(() => {
      setUser({
        id: role === 'user' ? 'u123' : 'admin_' + Date.now(),
        phone: '13800138000',
        verified: role !== 'user',
        verifyStatus: role !== 'user' ? 'verified' : 'unverified',
        role: role,
        name: role === 'beiyi_admin' ? '北医管理员' : role === 'insurance_admin' ? '保险审核员' : undefined
      });
      if (role === 'user') {
        setCurrentView('verify');
      } else {
        setCurrentView('reviewWorkbench');
      }
      setLoading(null);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white flex flex-col items-center justify-center p-8"
    >
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
        <ShieldCheck size={32} className="text-white" />
      </div>
      <h1 className="text-xl font-bold text-slate-800 tracking-tight mb-2">运动员医疗管理系统 <span className="text-blue-600">MVP</span></h1>
      <p className="text-xs text-slate-500 text-center mb-12">为集训人员提供便捷的保险理赔与住院预申请服务</p>

      <div className="w-full space-y-3">
        <button
          onClick={() => handleWechatLogin('user')}
          disabled={loading !== null}
          className="w-full bg-slate-900 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 active:bg-slate-800 transition-colors disabled:opacity-70 shadow-lg shadow-slate-200"
        >
          <MessageCircle size={18} />
          <span>微信授权登录 (队员)</span>
        </button>
        <button
          onClick={() => handleWechatLogin('beiyi_admin')}
          disabled={loading !== null}
          className="w-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 active:bg-blue-100 transition-colors disabled:opacity-70"
        >
          <Building size={16} />
          <span>北医管理入口</span>
        </button>
        <button
          onClick={() => handleWechatLogin('insurance_admin')}
          disabled={loading !== null}
          className="w-full bg-green-50 text-green-700 border border-green-100 text-sm font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 active:bg-green-100 transition-colors disabled:opacity-70"
        >
          <Briefcase size={16} />
          <span>保险理赔中心</span>
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-6">登录即表示同意《用户服务协议》及《隐私政策》</p>
    </motion.div>
  );
}

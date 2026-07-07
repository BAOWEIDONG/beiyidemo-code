import { useState } from 'react';
import { useAppStore } from '../store';
import { ShieldCheck, Camera, X } from 'lucide-react';
import { Header } from '../components/Header';
import { motion } from 'motion/react';

export function VerifyIdentityView() {
  const { user, updateUser, setCurrentView } = useAppStore();
  const [name, setName] = useState(user?.name || '');
  const [idCard, setIdCard] = useState(user?.idCard || '');
  const [frontImg, setFrontImg] = useState(user?.idCardFront || '');
  const [backImg, setBackImg] = useState(user?.idCardBack || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPending = user?.verifyStatus === 'pending';
  const isRejected = user?.verifyStatus === 'rejected';

  const handleUpload = (type: 'front' | 'back') => {
    // Simulate taking a photo
    const mockImg = `https://picsum.photos/seed/${Math.random()}/300/200`;
    if (type === 'front') setFrontImg(mockImg);
    else setBackImg(mockImg);
  };

  const handleVerify = () => {
    if (!name || !idCard || !frontImg || !backImg) {
      setError('请完整填写信息并上传证件正反面');
      return;
    }
    
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // Simulate validation. If user input name is 队医王, approve immediately for demo,
      // otherwise put in pending state.
      if (name === '队医王' && idCard === '110105199001011234') {
        updateUser({
          name,
          idCard,
          idCardFront: frontImg,
          idCardBack: backImg,
          verified: true,
          verifyStatus: 'approved',
          insuranceStatus: 'active',
          insuranceBatch: '2026年度集训人员保障计划',
          insuranceCompany: '中国人民健康保险',
          validFrom: '2026-01-01',
          validUntil: '2026-12-31',
          totalLimit: 50000,
          usedLimit: 428.5,
          remainingLimit: 49571.5
        });
        setCurrentView('home');
      } else {
        updateUser({
          name,
          idCard,
          idCardFront: frontImg,
          idCardBack: backImg,
          verifyStatus: 'pending',
          verified: false
        });
        setError('');
      }
      setLoading(false);
    }, 1200);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={32} className="text-blue-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">队医认证审核中</h2>
        <p className="text-xs text-slate-500 text-center mb-8">您已提交认证材料，管理员正在审核，请耐心等待。</p>
        
        <div className="w-full space-y-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-[10px] text-slate-400 mb-1">姓名</p>
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-[10px] text-slate-400 mb-1">身份证号</p>
            <p className="text-sm font-medium text-slate-800">{user?.idCard}</p>
          </div>
        </div>

        <button
          onClick={() => {
            updateUser({ verifyStatus: 'approved', verified: true, insuranceStatus: 'active', insuranceBatch: '2026年度集训', insuranceCompany: '测试保险', totalLimit: 10000, remainingLimit: 10000 });
            setCurrentView('home');
          }}
          className="w-full bg-slate-100 text-slate-600 text-sm font-bold py-3.5 rounded-xl transition-colors"
        >
          [Demo] 模拟审核通过
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-safe">
      <Header title="队医认证" backTo="login" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6 flex flex-col"
      >
        {isRejected && (
          <div className="bg-red-50 text-red-800 p-4 rounded-2xl flex items-start mb-6">
            <p className="text-[11px] leading-relaxed font-medium">认证被驳回：{user?.verifyRejectReason}。请重新上传。</p>
          </div>
        )}

        <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl flex items-start mb-6">
          <ShieldCheck className="shrink-0 mr-3 mt-0.5 text-blue-600" size={18} />
          <p className="text-[11px] leading-relaxed font-medium">请填写您的真实姓名和身份证号，并上传身份证正反面照片进行队医认证。系统将校验白名单。</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">姓名</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入真实姓名"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 text-slate-800 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">身份证号</label>
            <input 
              type="text" 
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              placeholder="请输入18位身份证号"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 text-slate-800 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">身份证正反面</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/2] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden">
              {frontImg ? (
                <>
                  <img src={frontImg} alt="front" className="w-full h-full object-cover" />
                  <button onClick={() => setFrontImg('')} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"><X size={14}/></button>
                </>
              ) : (
                <button onClick={() => handleUpload('front')} className="flex flex-col items-center justify-center w-full h-full text-slate-400 active:bg-slate-100">
                  <Camera size={24} className="mb-2" />
                  <span className="text-[10px] font-medium">点击拍摄人像面</span>
                </button>
              )}
            </div>
            
            <div className="relative aspect-[3/2] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden">
              {backImg ? (
                <>
                  <img src={backImg} alt="back" className="w-full h-full object-cover" />
                  <button onClick={() => setBackImg('')} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"><X size={14}/></button>
                </>
              ) : (
                <button onClick={() => handleUpload('back')} className="flex flex-col items-center justify-center w-full h-full text-slate-400 active:bg-slate-100">
                  <Camera size={24} className="mb-2" />
                  <span className="text-[10px] font-medium">点击拍摄国徽面</span>
                </button>
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl active:bg-blue-700 transition-colors disabled:opacity-70 shadow-lg shadow-blue-100"
          >
            {loading ? '提交中...' : '提交认证'}
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-4">测试提示：输入 张三 / 110105199001011234 可直接通过</p>
        </div>
      </motion.div>
    </div>
  );
}

import { useAppStore } from '../store';
import { ShieldCheck, FileText, Activity, Clock, FilePlus2, ChevronRight, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function HomeView() {
  const { user, claims, inpatientApps, setCurrentView } = useAppStore();
  
  const userClaims = claims.filter(c => c.userId === user?.id).map(c => ({
    ...c,
    _type: 'claim'
  }));
  const userInpatientApps = inpatientApps.filter(a => a.userId === user?.id).map(a => ({
    ...a,
    _type: 'inpatient'
  }));
  
  const allRecent = [...userClaims, ...userInpatientApps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const limitPercent = user?.totalLimit && user?.usedLimit 
    ? (user.usedLimit / user.totalLimit) * 100 
    : 0;

  const isExpired = user?.insuranceStatus === 'inactive' || (user?.validUntil && new Date(user.validUntil) < new Date());
  
  return (
    <div className="min-h-screen bg-white pb-20 flex flex-col">
      <div className="p-5 flex-1">
        
        {/* Insurance Card */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`rounded-2xl p-5 text-white shadow-lg mb-6 ${isExpired ? 'bg-slate-400 shadow-slate-200' : 'bg-blue-600 shadow-blue-200'}`}
        >
          <div className="flex justify-end items-start mb-1">
            <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full">{isExpired ? '已失效' : '生效中'}</span>
          </div>
          <h3 className="text-3xl font-bold mb-4">{user?.insuranceBatch || '年度集训人员险'}</h3>
          
          <div className="flex justify-between text-[10px] opacity-80 pt-1">
            <span>保障期限：{user?.validFrom || '2026-01-01'} 至 {user?.validUntil || '2026-12-31'}</span>
            <span>{user?.name}</span>
          </div>
        </motion.div>

        {/* 2 Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={() => setCurrentView('claimApply')}
            disabled={isExpired}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-transform ${isExpired ? 'bg-slate-100 border-slate-200 opacity-50' : 'bg-slate-50 border-slate-100 active:scale-95'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isExpired ? 'bg-slate-200' : 'bg-blue-100'}`}>
              <FilePlus2 className={`w-5 h-5 ${isExpired ? 'text-slate-400' : 'text-blue-600'}`} />
            </div>
            <span className="text-xs font-bold text-slate-800">门急诊报销</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('inpatientApply')}
            disabled={isExpired}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-transform ${isExpired ? 'bg-slate-100 border-slate-200 opacity-50' : 'bg-slate-50 border-slate-100 active:scale-95'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isExpired ? 'bg-slate-200' : 'bg-purple-100'}`}>
              <Activity className={`w-5 h-5 ${isExpired ? 'text-slate-400' : 'text-purple-600'}`} />
            </div>
            <span className="text-xs font-bold text-slate-800">住院报备</span>
          </button>
        </div>

        {/* Reviewer Workbench Entry (Only for Admins) */}
        {(user?.role === 'beiyi_admin' || user?.role === 'insurance_admin' || user?.role === 'super_admin') && (
          <div className="mb-8">
            <button 
              onClick={() => setCurrentView('reviewWorkbench')}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-xl shadow-lg flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 relative">
                  <Briefcase className="text-white" size={20} />
                  {/* Mock counter badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-slate-800">3</div>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">审核工作台</div>
                  <div className="text-white/70 text-[10px] mt-0.5">
                    {user.role === 'beiyi_admin' ? '北医审核入口' : user.role === 'insurance_admin' ? '保险审核入口' : '管理员审核入口'}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-white/50" size={20} />
            </button>
          </div>
        )}

        {/* Recent Applications */}
        <div>
          <h4 className="text-xs font-bold mb-3 text-slate-800 uppercase tracking-wider flex justify-between items-center">
            最近申请
          </h4>
          <div className="space-y-3">
            {allRecent.length > 0 ? allRecent.map(item => (
              <div 
                key={item.id} 
                onClick={() => setCurrentView('my', { defaultTab: item._type === 'claim' ? 'claim' : 'inpatient', targetId: item.id })}
                className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full ${['已审核', '已确认'].includes(item.status) ? 'bg-green-400' : item.status === '已驳回' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{item.hospitalName}{(item as any).department ? ` - ${(item as any).department}` : ''} {item._type === 'claim' ? `${(item as any).type}报销` : '住院报备'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">就医队员: {item.patientName} · {format(new Date(item.createdAt), 'yyyy-MM-dd')} · <span className={['待审核', '待确认'].includes(item.status) ? 'text-amber-500 font-bold' : ['已审核', '已确认'].includes(item.status) ? 'text-green-500 font-bold' : item.status === '已驳回' ? 'text-red-500 font-bold' : 'text-slate-500 font-bold'}>{item.status}</span></p>
                </div>
                {item._type === 'claim' && (
                   <span className="text-xs font-bold text-slate-800">¥{(item as any).amount}</span>
                )}
              </div>
            )) : (
              <div className="text-center py-6 text-slate-400 text-xs border border-slate-100 rounded-xl">
                暂无记录
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

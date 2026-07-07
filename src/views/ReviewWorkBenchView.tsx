import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { LogOut, Filter, Check, X, Download, FileText, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Claim, InpatientApp } from '../types';

export function ReviewWorkBenchView() {
  const { user, claims, inpatientApps, updateClaim, updateInpatientApp, setCurrentView, setUser } = useAppStore();
  
  const isBeiyi = user?.role === 'beiyi_admin' || user?.role === 'super_admin';
  const isInsurance = user?.role === 'insurance_admin' || user?.role === 'super_admin';
  
  const [tab, setTab] = useState<'claim' | 'inpatient'>(isInsurance && !isBeiyi ? 'claim' : 'inpatient');
  
  useEffect(() => {
    if (isInsurance && !isBeiyi) setTab('claim');
    else if (isBeiyi && !isInsurance) setTab('inpatient');
  }, [isBeiyi, isInsurance]);
  
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedInpatient, setSelectedInpatient] = useState<InpatientApp | null>(null);
  
  const [rejectReason, setRejectReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  
  const [claimFilter, setClaimFilter] = useState<'全部'|'待审核'|'已审核'|'已驳回'>('待审核');
  const [inpatientFilter, setInpatientFilter] = useState<'全部'|'待确认'|'已确认'|'已驳回'>('待确认');
  
  const filteredClaims = claims.filter(c => {
    if (!isInsurance) return false;
    if (claimFilter === '待审核') return c.status === '待审核';
    if (claimFilter === '已审核') return c.status === '已审核';
    if (claimFilter === '已驳回') return c.status === '已驳回';
    return true; // 全部
  });

  const filteredInpatients = inpatientApps.filter(c => {
    if (!isBeiyi) return false;
    if (inpatientFilter === '待确认') return c.status === '待确认';
    if (inpatientFilter === '已确认') return c.status === '已确认';
    if (inpatientFilter === '已驳回') return c.status === '已驳回';
    return true; // 全部
  });

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isAlert?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, isAlert = false) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, isAlert });
  };

  const hideConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleApproveClaim = () => {
    if (!selectedClaim) return;
    
    if (selectedClaim.status === '待审核') {
      const amount = parseFloat(approvedAmount);
      if (!amount || amount <= 0) {
        showConfirm('提示', '请输入正确的核定赔付金额', hideConfirm, true);
        return;
      }
      showConfirm('确认通过', '确定要通过该理赔并打款吗？', () => {
        updateClaim(selectedClaim.id, { 
          status: '已审核', 
          approvedAmount: amount,
          insuranceOpinion: '审核通过，已触发打款' 
        });
        setSelectedClaim(null);
        setApprovedAmount('');
        hideConfirm();
      });
    }
  };

  const handleRejectClaim = () => {
    if (!selectedClaim) return;
    if (!rejectReason) {
      showConfirm('提示', '请填写驳回原因', hideConfirm, true);
      return;
    }
    
    showConfirm('确认驳回', '确定要驳回该理赔吗？', () => {
      updateClaim(selectedClaim.id, { 
        status: '已驳回', 
        rejectReason 
      });
      setSelectedClaim(null);
      setRejectReason('');
      hideConfirm();
    });
  };

  const handleApproveInpatient = () => {
    if (!selectedInpatient) return;
    showConfirm('确认通过', '确定要通过该住院报备吗？', () => {
      updateInpatientApp(selectedInpatient.id, { status: '已确认' });
      setSelectedInpatient(null);
      hideConfirm();
    });
  };

  const handleRejectInpatient = () => {
    if (!selectedInpatient) return;
    if (!rejectReason) {
      showConfirm('提示', '请填写驳回原因', hideConfirm, true);
      return;
    }
    showConfirm('确认驳回', '确定要驳回该住院报备吗？', () => {
      updateInpatientApp(selectedInpatient.id, { status: '已驳回', rejectReason });
      setSelectedInpatient(null);
      setRejectReason('');
      hideConfirm();
    });
  };

  const downloadFile = (url: string, name: string) => {
    alert(`正在下载文件: ${name}`);
  };

  const renderMaterials = (title: string, urls: string[] | undefined) => {
    if (!urls || urls.length === 0) return null;
    return (
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-2">
        <div className="flex items-center text-slate-700">
          <FileText size={16} className="mr-2 text-slate-400" />
          <span className="text-xs font-medium">{title}</span>
        </div>
        <div className="flex gap-2">
          {urls.map((url, i) => (
            <img key={i} src={url} alt={title} className="w-10 h-10 object-cover rounded-md border border-slate-200" onClick={() => window.open(url, '_blank')} />
          ))}
        </div>
      </div>
    );
  };

  const renderList = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
      {tab === 'claim' && filteredClaims.map(claim => (
        <div key={claim.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm font-bold text-slate-800 mr-2">{claim.patientName} <span className="text-[10px] font-normal text-slate-500">(由{claim.userName}提交)</span></span>
              <span className="text-[10px] text-slate-400">单号: {claim.id}</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{claim.status}</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 mb-3">
            <p>就诊医院: {claim.hospitalName}</p>
            <p>申请金额: <span className="font-bold text-slate-800">¥{claim.amount?.toFixed(2)}</span></p>
            <p>提交时间: {format(new Date(claim.createdAt), 'yyyy-MM-dd HH:mm')}</p>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setSelectedClaim(claim)}
              className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md active:bg-slate-800"
            >
              {claim.status === '待审核' ? '去审核' : '查看'}
            </button>
          </div>
        </div>
      ))}
      
      {tab === 'inpatient' && filteredInpatients.map(app => (
        <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm font-bold text-slate-800 mr-2">{app.patientName} <span className="text-[10px] font-normal text-slate-500">(由{app.userName}提交)</span></span>
              <span className="text-[10px] text-slate-400">单号: {app.id}</span>
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{app.status}</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 mb-3">
            <p>意向医院: {app.hospitalName}</p>
            <p>预计入院: <span className="font-bold text-slate-800">{app.date}</span></p>
            <p>提交时间: {format(new Date(app.createdAt), 'yyyy-MM-dd HH:mm')}</p>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setSelectedInpatient(app)}
              className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md active:bg-purple-700"
            >
              {app.status === '待确认' ? '去处理' : '查看'}
            </button>
          </div>
        </div>
      ))}

      {(tab === 'claim' && filteredClaims.length === 0) || (tab === 'inpatient' && filteredInpatients.length === 0) ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          暂无订单
        </div>
      ) : null}
    </div>
  );

  const renderClaimDetail = () => {
    if (!selectedClaim) return null;
    return (
      <div className="absolute inset-0 z-40 bg-slate-50 flex flex-col">
        <div className="bg-white px-4 pt-8 pb-3 shrink-0 flex items-center border-b border-slate-100 shadow-sm sticky top-0">
          <button onClick={() => { setSelectedClaim(null); setRejectReason(''); setApprovedAmount(''); }} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-base font-bold text-slate-800 pr-6">门急诊理赔详情</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-3">申请信息</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span className="text-slate-400">就诊队员</span><span className="font-medium text-slate-800">{selectedClaim.patientName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">身份证号</span><span className="font-medium text-slate-800">{selectedClaim.patientIdCard}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">申请人(队医)</span><span className="font-medium text-slate-800">{selectedClaim.userName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">人员类型</span><span className="font-medium text-slate-800">国家队集训运动员</span></div>
              <div className="flex justify-between"><span className="text-slate-400">保障批次</span><span className="font-medium text-slate-800">2026年度集训人员险</span></div>
              <div className="flex justify-between"><span className="text-slate-400">就诊医院</span><span className="font-medium text-slate-800">{selectedClaim.hospitalName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">就诊时间</span><span className="font-medium text-slate-800">{selectedClaim.date}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-50"><span className="text-slate-400">申请金额</span><span className="font-bold text-slate-800 text-sm">¥{selectedClaim.amount?.toFixed(2)}</span></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-3">收款人信息</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span className="text-slate-400">姓名</span><span className="font-medium text-slate-800">{selectedClaim.payeeName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">开户行</span><span className="font-medium text-slate-800">{selectedClaim.payeeBank}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">卡号</span><span className="font-medium text-slate-800">{selectedClaim.payeeAccount}</span></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-800">材料附件</h3>
              <button className="text-[10px] text-blue-600 font-bold flex items-center gap-1" onClick={() => alert('打包下载全部材料')}>
                 <Download size={12}/> 全部下载
              </button>
            </div>
            {renderMaterials('队员身份证正面', selectedClaim.patientIdCardFront ? [selectedClaim.patientIdCardFront] : [])}
            {renderMaterials('队员身份证反面', selectedClaim.patientIdCardBack ? [selectedClaim.patientIdCardBack] : [])}
            {renderMaterials('发票照片', selectedClaim.images.invoice)}
            {renderMaterials('病历记录', selectedClaim.images.record)}
            {renderMaterials('费用清单', selectedClaim.images.cost)}
            {renderMaterials('处方单', selectedClaim.images.prescription)}
            {renderMaterials('诊断证明', selectedClaim.images.diagnosis)}
          </div>

          {selectedClaim.status === '待审核' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-2">核定赔付金额 (元)</h3>
              <input 
                type="number"
                value={approvedAmount}
                onChange={e => setApprovedAmount(e.target.value)}
                placeholder="请输入核定金额"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-400"
              />
            </div>
          )}
          
          {selectedClaim.status === '待审核' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-2">驳回原因 (仅驳回时需填写)</h3>
              <textarea 
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="请输入驳回原因或需补充的材料..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-red-400 resize-none"
              />
            </div>
          )}
          
          {selectedClaim.rejectReason && selectedClaim.status === '已驳回' && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <h3 className="text-xs font-bold text-red-800 mb-2">驳回原因</h3>
              <p className="text-sm text-red-600">{selectedClaim.rejectReason}</p>
            </div>
          )}
        </div>

        {selectedClaim.status === '待审核' && (
          <div className="p-4 border-t border-slate-100 bg-white flex gap-3 shrink-0 pb-safe">
            <button 
              onClick={handleRejectClaim}
              className="flex-1 py-3.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex justify-center items-center gap-1 active:bg-red-100 transition-colors"
            >
              <X size={16} /> 驳回
            </button>
            <button 
              onClick={handleApproveClaim}
              className="flex-[2] py-3.5 bg-green-500 text-white rounded-xl font-bold text-sm flex justify-center items-center gap-1 shadow-lg shadow-green-200 active:bg-green-600 transition-colors"
            >
              <Check size={16} /> 通过并打款
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderInpatientDetail = () => {
    if (!selectedInpatient) return null;
    return (
      <div className="absolute inset-0 z-40 bg-slate-50 flex flex-col">
        <div className="bg-white px-4 pt-8 pb-3 shrink-0 flex items-center border-b border-slate-100 shadow-sm sticky top-0">
          <button onClick={() => { setSelectedInpatient(null); setRejectReason(''); }} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-base font-bold text-slate-800 pr-6">住院报备处理</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-3">报备信息</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span className="text-slate-400">就诊队员</span><span className="font-medium text-slate-800">{selectedInpatient.patientName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">身份证号</span><span className="font-medium text-slate-800">{selectedInpatient.patientIdCard}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">申请人(队医)</span><span className="font-medium text-slate-800">{selectedInpatient.userName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">意向医院</span><span className="font-medium text-slate-800">{selectedInpatient.hospitalName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">预计入院</span><span className="font-medium text-slate-800">{selectedInpatient.date}</span></div>
              <div className="flex flex-col mt-2 pt-2 border-t border-slate-50">
                <span className="text-slate-400 mb-1">病因描述</span>
                <span className="font-medium text-slate-800 leading-relaxed bg-slate-50 p-2 rounded-lg">{selectedInpatient.cause}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-800">材料附件</h3>
              <button className="text-[10px] text-blue-600 font-bold flex items-center gap-1" onClick={() => alert('打包下载全部材料')}>
                 <Download size={12}/> 全部下载
              </button>
            </div>
            {renderMaterials('队员身份证正面', selectedInpatient.patientIdCardFront ? [selectedInpatient.patientIdCardFront] : [])}
            {renderMaterials('队员身份证反面', selectedInpatient.patientIdCardBack ? [selectedInpatient.patientIdCardBack] : [])}
            {renderMaterials('住院通知单', selectedInpatient.images)}
          </div>
          
          {selectedInpatient.status === '待确认' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-2">驳回原因 (仅驳回时需填写)</h3>
              <textarea 
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="请输入驳回原因..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-red-400 resize-none"
              />
            </div>
          )}
          
          {selectedInpatient.rejectReason && selectedInpatient.status === '已驳回' && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <h3 className="text-xs font-bold text-red-800 mb-2">驳回原因</h3>
              <p className="text-sm text-red-600">{selectedInpatient.rejectReason}</p>
            </div>
          )}
        </div>

        {selectedInpatient.status === '待确认' && (
          <div className="p-4 border-t border-slate-100 bg-white flex gap-3 shrink-0 pb-safe">
            <button 
              onClick={handleRejectInpatient}
              className="flex-1 py-3.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex justify-center items-center gap-1 active:bg-red-100 transition-colors"
            >
              <X size={16} /> 驳回重填
            </button>
            <button 
              onClick={handleApproveInpatient}
              className="flex-[2] py-3.5 bg-purple-600 text-white rounded-xl font-bold text-sm flex justify-center items-center gap-1 shadow-lg shadow-purple-200 active:bg-purple-700 transition-colors"
            >
              <Check size={16} /> 确认并安排结算
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="bg-white px-4 pt-8 pb-3 shrink-0 z-30 sticky top-0 border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">{isBeiyi ? '北医' : '保险'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-800">
              工作台
            </h2>
          </div>
          <button onClick={handleLogout} className="text-slate-500 p-2 rounded-full hover:bg-slate-50 active:bg-slate-100 flex items-center gap-1">
            <LogOut size={16} /> <span className="text-xs font-bold">退出</span>
          </button>
        </div>

        {user?.role === 'super_admin' ? (
          <div className="flex space-x-6">
            <button 
              onClick={() => setTab('claim')}
              className={`pb-2 text-sm font-bold relative ${tab === 'claim' ? 'text-slate-900' : 'text-slate-400'}`}
            >
              门急诊理赔 <span className="ml-1 bg-slate-100 text-slate-600 text-[10px] px-1.5 rounded-full">{claims.filter(c => c.status === '待审核').length}</span>
              {tab === 'claim' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setTab('inpatient')}
              className={`pb-2 text-sm font-bold relative ${tab === 'inpatient' ? 'text-slate-900' : 'text-slate-400'}`}
            >
              住院报备 <span className="ml-1 bg-purple-100 text-purple-600 text-[10px] px-1.5 rounded-full">{inpatientApps.filter(c => c.status === '待确认').length}</span>
              {tab === 'inpatient' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>}
            </button>
          </div>
        ) : (
          <div className="pb-2 text-sm font-bold text-slate-900 relative inline-block">
            {isInsurance ? '门急诊理赔' : '住院报备'}
            <span className="ml-2 bg-slate-100 text-slate-600 text-[10px] px-1.5 rounded-full">
              {isInsurance ? claims.filter(c => c.status === '待审核').length : inpatientApps.filter(c => c.status === '待确认').length}
            </span>
          </div>
        )}
        
        {tab === 'claim' && isInsurance && (
          <div className="flex space-x-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {['全部', '待审核', '已审核', '已驳回'].map(f => (
              <button 
                key={f}
                onClick={() => setClaimFilter(f as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${claimFilter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
        
        {tab === 'inpatient' && isBeiyi && (
          <div className="flex space-x-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {['全部', '待确认', '已确认', '已驳回'].map(f => (
              <button 
                key={f}
                onClick={() => setInpatientFilter(f as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${inpatientFilter === f ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {renderList()}
      {renderClaimDetail()}
      {renderInpatientDetail()}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3">
              {!confirmDialog.isAlert && (
                <button 
                  onClick={hideConfirm}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm"
                >
                  取消
                </button>
              )}
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

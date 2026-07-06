
import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { cancelClaimService, cancelInpatientAppService } from '../api/c_end_service';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { Claim, InpatientApp } from '../types';

export function MyRecordsView() {
  const { user, claims, inpatientApps, updateClaim, updateInpatientApp, setUser, setCurrentView, viewProps } = useAppStore();
  const [tab, setTab] = useState<'claim'|'inpatient'>(viewProps?.defaultTab || 'claim');
  
  const [claimFilter, setClaimFilter] = useState<'全部'|'待审核'|'已审核'|'已撤销'|'已驳回'>('全部');
  const [inpatientFilter, setInpatientFilter] = useState<'全部'|'待确认'|'已确认'|'已撤销'|'已驳回'>('全部');
  
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedInpatient, setSelectedInpatient] = useState<InpatientApp | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (viewProps?.targetId) {
      if (viewProps.defaultTab === 'claim') {
        const c = claims.find(c => c.id === viewProps.targetId);
        if (c) setSelectedClaim(c);
      } else if (viewProps.defaultTab === 'inpatient') {
        const i = inpatientApps.find(a => a.id === viewProps.targetId);
        if (i) setSelectedInpatient(i);
      }
      setCurrentView('my', { ...viewProps, targetId: undefined });
    }
  }, [viewProps?.targetId]);
  
  const userClaims = claims.filter(c => {
    if (c.userId !== user?.id) return false;
    if (claimFilter === '待审核') return c.status === '待审核';
    if (claimFilter === '已审核') return c.status === '已审核';
    if (claimFilter === '已撤销') return c.status === '已撤销';
    if (claimFilter === '已驳回') return c.status === '已驳回';
    return true;
  });
  
  const userInpatients = inpatientApps.filter(c => {
    if (c.userId !== user?.id) return false;
    if (inpatientFilter === '待确认') return c.status === '待确认';
    if (inpatientFilter === '已确认') return c.status === '已确认';
    if (inpatientFilter === '已撤销') return c.status === '已撤销';
    if (inpatientFilter === '已驳回') return c.status === '已驳回';
    return true;
  });

  const getStatusColor = (status: string) => {
    if (status === '已审核' || status === '已确认') return 'text-green-600 bg-green-50 border-green-100';
    if (status === '已驳回') return 'text-red-600 bg-red-50 border-red-100';
    if (status === '待审核' || status === '待确认') return 'text-blue-600 bg-blue-50 border-blue-100';
    if (status === '已撤销') return 'text-slate-500 bg-slate-100 border-slate-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-100';
  };

  const getStatusIcon = (status: string) => {
    if (status === '已审核' || status === '已确认') return <CheckCircle2 size={14} className="text-green-600" />;
    if (status === '已驳回') return <XCircle size={14} className="text-red-600" />;
    if (status === '待审核' || status === '待确认') return <Clock size={14} className="text-blue-600" />;
    return <Clock size={14} className="text-yellow-600" />;
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const hideConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleWithdrawClaim = () => {
    if (!selectedClaim) return;
    showConfirm('确认撤销', '确定要撤销该报销申请吗？', async () => {
      try {
        await cancelClaimService(selectedClaim.id);
        updateClaim(selectedClaim.id, { status: '已撤销' });
        setSelectedClaim(null);
        hideConfirm();
      } catch (err: any) {
        alert(err.message || '撤销失败');
      }
    });
  };

  const handleWithdrawInpatient = () => {
    if (!selectedInpatient) return;
    showConfirm('确认撤销', '确定要撤销该住院报备吗？', async () => {
      try {
        await cancelInpatientAppService(selectedInpatient.id);
        updateInpatientApp(selectedInpatient.id, { status: '已撤销' });
        setSelectedInpatient(null);
        hideConfirm();
      } catch (err: any) {
        alert(err.message || '撤销失败');
      }
    });
  };

  const renderImageSection = (title: string, images: string[]) => {
    if (!images || images.length === 0) return null;
    return (
      <div className="mt-2 border-t border-slate-50 pt-3">
        <h5 className="text-[10px] font-bold text-slate-400 mb-2">{title}</h5>
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <img key={i} src={img} alt="material" className="w-12 h-12 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setPreviewImage(img)} />
          ))}
        </div>
      </div>
    );
  };

  const renderConfirmDialog = () => {
    if (!confirmDialog.isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
          <h3 className="text-lg font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
          <p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
          <div className="flex gap-3">
            <button 
              onClick={hideConfirm}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm"
            >
              取消
            </button>
            <button 
              onClick={confirmDialog.onConfirm}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedClaim) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative z-50">
        <div className="bg-white px-4 pt-8 pb-3 shrink-0 flex items-center border-b border-slate-100 sticky top-0">
          <button onClick={() => setSelectedClaim(null)} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-base font-bold text-slate-800 pr-6">门急诊报销详情</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className={`mb-3 flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(selectedClaim.status)}`}>
              {getStatusIcon(selectedClaim.status)}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{selectedClaim.status}</h3>
            <p className="text-xs text-slate-400">单号: {selectedClaim.id}</p>
            {selectedClaim.status === '待审核' && (
              <button onClick={handleWithdrawClaim} className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full active:bg-slate-200">
                撤销申请
              </button>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">基本信息</h4>
            <div className="flex justify-between text-xs"><span className="text-slate-500">就诊队员</span><span className="font-medium">{selectedClaim.patientName}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">身份证号</span><span className="font-medium">{selectedClaim.patientIdCard}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">就诊医院</span><span className="font-medium">{selectedClaim.hospitalName}</span></div>
            {selectedClaim.department && <div className="flex justify-between text-xs"><span className="text-slate-500">就诊科室</span><span className="font-medium">{selectedClaim.department}</span></div>}
            <div className="flex justify-between text-xs"><span className="text-slate-500">就诊日期</span><span className="font-medium">{selectedClaim.date}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">就诊类型</span><span className="font-medium">{selectedClaim.type}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">申请金额</span><span className="font-bold">¥{selectedClaim.amount.toFixed(2)}</span></div>
            {selectedClaim.approvedAmount !== undefined && (
               <div className="flex justify-between text-xs pt-2 border-t border-slate-50"><span className="text-slate-500">核定金额</span><span className="font-bold text-green-600">¥{selectedClaim.approvedAmount.toFixed(2)}</span></div>
            )}
            
            {renderImageSection('队员身份证正面', selectedClaim.patientIdCardFront ? [selectedClaim.patientIdCardFront] : [])}
            {renderImageSection('队员身份证反面', selectedClaim.patientIdCardBack ? [selectedClaim.patientIdCardBack] : [])}
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">收款信息</h4>
            <div className="flex justify-between text-xs"><span className="text-slate-500">收款人</span><span className="font-medium">{selectedClaim.payeeName}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">开户行</span><span className="font-medium">{selectedClaim.payeeBank}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">卡号</span><span className="font-medium">{selectedClaim.payeeAccount}</span></div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">材料附件</h4>
            {renderImageSection('发票', selectedClaim.images.invoice)}
            {renderImageSection('门诊病历', selectedClaim.images.record)}
            {renderImageSection('费用明细', selectedClaim.images.cost)}
            {renderImageSection('处方', selectedClaim.images.prescription)}
            {renderImageSection('诊断证明', selectedClaim.images.diagnosis)}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
             <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">流转进度</h4>
             <div className="relative pl-4 border-l-2 border-slate-100 space-y-4 text-xs">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <p className="text-slate-800 font-medium">提交申请</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{format(new Date(selectedClaim.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                </div>
                {selectedClaim.status === '已撤销' && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                    <p className="text-slate-800 font-medium">已撤销</p>
                  </div>
                )}
                {selectedClaim.auditHistory && selectedClaim.auditHistory.map(record => (
                  <div key={record.id} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${record.status === '通过' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                    <p className="text-slate-800 font-medium">{record.reviewLevel} {record.status}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{format(new Date(record.reviewTime), 'yyyy-MM-dd HH:mm')} · {record.reviewerName}</p>
                    {record.feedback && <p className="text-slate-600 text-[10px] mt-1 bg-slate-50 p-1.5 rounded">{record.feedback}</p>}
                  </div>
                ))}
                {!selectedClaim.auditHistory && selectedClaim.status !== '待审核' && selectedClaim.status !== '已撤销' && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                    <p className="text-slate-800 font-medium">保险公司审核 {selectedClaim.status === '已驳回' ? '未通过' : '完成'}</p>
                    {selectedClaim.completedAt && <p className="text-slate-400 text-[10px] mt-0.5">{format(new Date(selectedClaim.completedAt), 'yyyy-MM-dd HH:mm')}</p>}
                    {selectedClaim.rejectReason && <p className="text-red-600 text-[10px] mt-1 bg-red-50 p-1.5 rounded">{selectedClaim.rejectReason}</p>}
                  </div>
                )}
                {selectedClaim.status === '已审核' && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <p className="text-slate-800 font-medium">已打款</p>
                  </div>
                )}
             </div>
          </div>
        </div>
        {renderConfirmDialog()}
      </div>
    );
  }

  if (selectedInpatient) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative z-50">
        <div className="bg-white px-4 pt-8 pb-3 shrink-0 flex items-center border-b border-slate-100 sticky top-0">
          <button onClick={() => setSelectedInpatient(null)} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-base font-bold text-slate-800 pr-6">住院报备详情</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className={`mb-3 flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(selectedInpatient.status)}`}>
              {getStatusIcon(selectedInpatient.status)}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{selectedInpatient.status}</h3>
            <p className="text-xs text-slate-400">单号: {selectedInpatient.id}</p>
            {selectedInpatient.status === '待确认' && (
              <button onClick={handleWithdrawInpatient} className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full active:bg-slate-200">
                撤销报备
              </button>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">基本信息</h4>
            <div className="flex justify-between text-xs"><span className="text-slate-500">就诊队员</span><span className="font-medium">{selectedInpatient.patientName}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">身份证号</span><span className="font-medium">{selectedInpatient.patientIdCard}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">意向医院</span><span className="font-medium">{selectedInpatient.hospitalName}</span></div>
            {selectedInpatient.department && <div className="flex justify-between text-xs"><span className="text-slate-500">就诊科室</span><span className="font-medium">{selectedInpatient.department}</span></div>}
            <div className="flex justify-between text-xs"><span className="text-slate-500">预计入院</span><span className="font-medium">{selectedInpatient.date}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">病因描述</span><span className="font-medium text-right max-w-[60%]">{selectedInpatient.cause}</span></div>
            {renderImageSection('队员身份证正面', selectedInpatient.patientIdCardFront ? [selectedInpatient.patientIdCardFront] : [])}
            {renderImageSection('队员身份证反面', selectedInpatient.patientIdCardBack ? [selectedInpatient.patientIdCardBack] : [])}
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">流转进度</h4>
            <div className="relative pl-4 border-l-2 border-slate-100 space-y-4 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                <p className="text-slate-800 font-medium">提交报备</p>
                <p className="text-slate-400 text-[10px] mt-0.5">{format(new Date(selectedInpatient.createdAt), 'yyyy-MM-dd HH:mm')}</p>
              </div>
              {selectedInpatient.status === '已撤销' && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <p className="text-slate-800 font-medium">已撤销</p>
                </div>
              )}
              {selectedInpatient.auditHistory && selectedInpatient.auditHistory.map(record => (
                <div key={record.id} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${record.status === '确认' ? 'bg-purple-400' : 'bg-red-400'}`}></div>
                  <p className="text-slate-800 font-medium">{record.reviewLevel} {record.status}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{format(new Date(record.reviewTime), 'yyyy-MM-dd HH:mm')} · {record.reviewerName}</p>
                  {record.feedback && <p className="text-slate-600 text-[10px] mt-1 bg-slate-50 p-1.5 rounded">{record.feedback}</p>}
                </div>
              ))}
              {!selectedInpatient.auditHistory && selectedInpatient.status !== '待确认' && selectedInpatient.status !== '已撤销' && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                  <p className="text-slate-800 font-medium">北医协调 {selectedInpatient.status === '已驳回' ? '未通过' : '通过'}</p>
                  {selectedInpatient.completedAt && <p className="text-slate-400 text-[10px] mt-0.5">{format(new Date(selectedInpatient.completedAt), 'yyyy-MM-dd HH:mm')}</p>}
                  {selectedInpatient.rejectReason && <p className="text-red-600 text-[10px] mt-1 bg-red-50 p-1.5 rounded">{selectedInpatient.rejectReason}</p>}
                </div>
              )}
              {selectedInpatient.status === '已确认' && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <p className="text-slate-800 font-medium">已安排挂账结算</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2 mb-2">材料附件</h4>
            {renderImageSection('住院通知单', selectedInpatient.images)}
          </div>
        </div>
        {renderConfirmDialog()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <div className="bg-white sticky top-0 z-10 border-b border-slate-100 shrink-0 pt-8 px-4 pb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-slate-800">我的理赔</h2>
          <button 
            onClick={() => { setUser(null); setCurrentView('login'); }}
            className="text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1 rounded-full font-medium"
          >
            退出登录
          </button>
        </div>
        <div className="flex space-x-6">
          <button 
            onClick={() => setTab('claim')}
            className={`pb-2 text-sm font-bold relative ${tab === 'claim' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            门诊报销
            {tab === 'claim' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setTab('inpatient')}
            className={`pb-2 text-sm font-bold relative ${tab === 'inpatient' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            住院报备
            {tab === 'inpatient' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>}
          </button>
        </div>
        
        {tab === 'claim' && (
          <div className="flex space-x-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {['全部', '待审核', '已审核', '已撤销', '已驳回'].map(f => (
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
        
        {tab === 'inpatient' && (
          <div className="flex space-x-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {['全部', '待确认', '已确认', '已撤销', '已驳回'].map(f => (
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

      <div className="flex-1 p-4 overflow-y-auto">
        {tab === 'claim' && (
          <div className="space-y-3">
            {userClaims.map(claim => (
              <div 
                key={claim.id} 
                onClick={() => setSelectedClaim(claim)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileText className="text-blue-500 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{claim.hospitalName}{claim.department ? ` - ${claim.department}` : ''}</h4>
                      <p className="text-[10px] text-slate-400">就医队员: {claim.patientName} · {format(new Date(claim.createdAt), 'yyyy-MM-dd HH:mm')} · {claim.type}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(claim.status)}`}>
                    {getStatusIcon(claim.status)}
                    {claim.status}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-slate-500">申请金额</span>
                    <span className="text-sm font-bold text-slate-800">¥{claim.amount?.toFixed(2)}</span>
                  </div>
                  {claim.approvedAmount !== undefined && (
                    <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                      <span className="text-[11px] text-slate-500">核定金额</span>
                      <span className="text-sm font-bold text-green-600">¥{claim.approvedAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {claim.completedAt && (claim.status === '已审核' || claim.status === '已驳回') && (
                    <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                      <span className="text-[11px] text-slate-500">审核时间</span>
                      <span className="text-[11px] text-slate-800">{format(new Date(claim.completedAt), 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                  )}
                </div>

                {claim.status === '已驳回' && (
                  <div className="mt-3 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg flex gap-1">
                     <AlertCircle size={14} className="shrink-0" />
                     <span>原因：{claim.rejectReason}</span>
                  </div>
                )}
                
                {claim.status === '已驳回' && claim.requiredDocs && claim.requiredDocs.length > 0 && (
                  <div className="mt-3 flex justify-end">
                    <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">补充材料</button>
                  </div>
                )}
              </div>
            ))}
            {userClaims.length === 0 && <p className="text-center text-xs text-slate-400 py-10">暂无门诊报销记录</p>}
          </div>
        )}

        {tab === 'inpatient' && (
          <div className="space-y-3">
            {userInpatients.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedInpatient(app)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50 transition-colors"
              >
                 <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                      <FileText className="text-purple-500 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{app.hospitalName}{app.department ? ` - ${app.department}` : ''}</h4>
                      <p className="text-[10px] text-slate-400">就医队员: {app.patientName} · {format(new Date(app.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                  <p><span className="text-slate-400 mr-2">预计入院:</span>{app.date}</p>
                  <p><span className="text-slate-400 mr-2">病因描述:</span>{app.cause}</p>
                  {app.completedAt && (app.status === '已确认' || app.status === '已驳回') && (
                    <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                      <span className="text-[11px] text-slate-500">审核时间</span>
                      <span className="text-[11px] text-slate-800">{format(new Date(app.completedAt), 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                  )}
                </div>

                {app.status === '已驳回' && (
                  <div className="mt-3 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg flex gap-1">
                     <AlertCircle size={14} className="shrink-0" />
                     <span>原因：{app.rejectReason}</span>
                  </div>
                )}
              </div>
            ))}
            {userInpatients.length === 0 && <p className="text-center text-xs text-slate-400 py-10">暂无住院申请记录</p>}
          </div>
        )}
      </div>
      {renderConfirmDialog()}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setPreviewImage(null)}
          >
            <X size={32} />
          </button>
          <img src={previewImage} alt="preview" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

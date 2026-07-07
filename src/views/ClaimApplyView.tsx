import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Header } from '../components/Header';
import { Camera, X, AlertCircle } from 'lucide-react';
import { MOCK_HOSPITALS } from '../mockData';
import { format } from 'date-fns';

export function ClaimApplyView() {
  const { user, addClaim, setCurrentView } = useAppStore();
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientIdCard, setPatientIdCard] = useState(user?.idCard || '');
  const [patientIdCardFront, setPatientIdCardFront] = useState<string[]>(user?.idCardFront ? [user.idCardFront] : []);
  const [patientIdCardBack, setPatientIdCardBack] = useState<string[]>(user?.idCardBack ? [user.idCardBack] : []);
  const [hospital, setHospital] = useState('');
  const [otherHospital, setOtherHospital] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'门诊'|'急诊'>('门诊');
  const [amount, setAmount] = useState('');
  
  const [payeeName, setPayeeName] = useState('');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [payeeBank, setPayeeBank] = useState('');
  
  const [invoice, setInvoice] = useState<string[]>([]);
  const [record, setRecord] = useState<string[]>([]);
  const [cost, setCost] = useState<string[]>([]);
  const [prescription, setPrescription] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const isOverLimit = user?.remainingLimit !== undefined && numAmount > user.remainingLimit;

  const handleUpload = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const mockImg = `https://picsum.photos/seed/${Math.random()}/300/300`;
    setter(prev => [...prev, mockImg]);
  };

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!patientName || !patientIdCard || patientIdCardFront.length === 0 || patientIdCardBack.length === 0 || !hospital || (hospital === 'other' && !otherHospital) || !date || !amount || !payeeName || !payeeAccount || !payeeBank || invoice.length === 0 || record.length === 0) {
      setError('请填写必填项，并至少上传发票和门诊病历，以及患者身份证正反面照片');
      return;
    }

    if (isOverLimit) {
      setError('金额超出剩余额度，无法提交');
      return;
    }

    const finalHospitalName = hospital === 'other' ? otherHospital : (MOCK_HOSPITALS.find(h => h.id === hospital)?.name || '');

    setLoading(true);
    setTimeout(() => {
      addClaim({
        id: 'C' + Date.now().toString().slice(-4),
        userId: user!.id,
        userName: user!.name!,
        patientName,
        patientIdCard,
        patientIdCardFront: patientIdCardFront[0],
        patientIdCardBack: patientIdCardBack[0],
        hospitalName: finalHospitalName,
        date,
        type,
        amount: numAmount,
        payeeName,
        payeeAccount,
        payeeBank,
        status: '待审核',
        createdAt: new Date().toISOString(),
        images: { invoice, record, cost, prescription, diagnosis }
      });
      setCurrentView('my');
      setLoading(false);
    }, 1000);
  };

  const renderUploadBox = (title: string, required: boolean, images: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
    <div className="mb-4">
      <p className="text-[10px] font-bold text-slate-500 mb-2">{title} {required && <span className="text-red-500">*</span>}</p>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100">
            <img src={img} alt="upload" className="w-full h-full object-cover" />
            <button onClick={() => handleRemove(setter, i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><X size={10}/></button>
          </div>
        ))}
        <button onClick={() => handleUpload(setter)} className="w-16 h-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 active:bg-slate-100">
          <Camera size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col pb-safe">
      <Header title="门急诊报销" backTo="home" />
      
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex items-start mb-6">
          <AlertCircle className="shrink-0 mr-2 mt-0.5 text-blue-600" size={16} />
          <p className="text-[10px] leading-relaxed font-medium">请确保发票、病历清晰可见。提交后直接交由保险公司审核打款。</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">就诊队员姓名 *</label>
            <input 
              type="text" 
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="请输入队员姓名"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">身份证号 *</label>
            <input 
              type="text" 
              value={patientIdCard}
              onChange={(e) => setPatientIdCard(e.target.value)}
              placeholder="请输入队员身份证号"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
            />
          </div>
          
          <div className="mb-4">
            {renderUploadBox('队员身份证正面', true, patientIdCardFront, setPatientIdCardFront)}
            <div className="mt-2"></div>
            {renderUploadBox('队员身份证反面', true, patientIdCardBack, setPatientIdCardBack)}
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">就诊医院 *</label>
            <select 
              value={hospital} 
              onChange={(e) => setHospital(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 mb-2"
            >
              <option value="">请选择合作医院</option>
              {MOCK_HOSPITALS.slice().sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance)).map(h => <option key={h.id} value={h.id}>{h.name} ({h.distance})</option>)}
              <option value="other">其他医院 (手动输入)</option>
            </select>
            {hospital === 'other' && (
              <input 
                type="text" 
                value={otherHospital}
                onChange={(e) => setOtherHospital(e.target.value)}
                placeholder="请输入医院全称"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
              />
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">就诊类型</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
              >
                <option value="门诊">门诊</option>
                <option value="急诊">急诊</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">就诊日期 *</label>
              <input 
                type="date" 
                value={date}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
              />
            </div>
          </div>
          
          <div>
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">费用总金额 (元) *</label>
             <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="请输入发票总金额"
                className={`w-full bg-slate-50 border ${isOverLimit ? 'border-red-300 text-red-600 focus:border-red-400' : 'border-slate-100 focus:border-blue-300'} rounded-xl px-4 py-3 text-sm focus:outline-none`}
              />
              {isOverLimit && <p className="text-red-500 text-[10px] mt-1 font-bold">超出剩余可用额度 (¥{user?.remainingLimit})</p>}
          </div>
        </div>

        <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">收款人信息</h3>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">收款人姓名 *</label>
            <input 
              type="text" 
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="请输入收款人姓名"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">收款银行卡号 *</label>
            <input 
              type="text" 
              value={payeeAccount}
              onChange={(e) => setPayeeAccount(e.target.value)}
              placeholder="请输入银行卡号"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">开户银行 *</label>
            <input 
              type="text" 
              value={payeeBank}
              onChange={(e) => setPayeeBank(e.target.value)}
              placeholder="例如: 工商银行北京中关村支行"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-50 pb-2">理赔材料上传</h3>
          {renderUploadBox('发票照片', true, invoice, setInvoice)}
          {renderUploadBox('门诊病历记录', true, record, setRecord)}
          {renderUploadBox('费用清单', false, cost, setCost)}
          {renderUploadBox('处方单', false, prescription, setPrescription)}
          {renderUploadBox('诊断证明', false, diagnosis, setDiagnosis)}
        </div>

        {error && <p className="text-red-500 text-xs font-medium mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || isOverLimit}
          className="w-full bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl active:bg-blue-700 transition-colors disabled:opacity-70 shadow-lg shadow-blue-100"
        >
          {loading ? '提交中...' : '提交报销'}
        </button>
      </div>
    </div>
  );
}

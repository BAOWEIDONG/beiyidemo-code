import { useState } from 'react';
import { useAppStore } from '../store';
import { Header } from '../components/Header';
import { Camera, X, AlertCircle } from 'lucide-react';
import { MOCK_HOSPITALS } from '../mockData';

export function InpatientApplyView() {
  const { user, addInpatientApp, setCurrentView } = useAppStore();
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientIdCard, setPatientIdCard] = useState(user?.idCard || '');
  const [patientIdCardFront, setPatientIdCardFront] = useState<string[]>(user?.idCardFront ? [user.idCardFront] : []);
  const [patientIdCardBack, setPatientIdCardBack] = useState<string[]>(user?.idCardBack ? [user.idCardBack] : []);
  
  const [hospital, setHospital] = useState('');
  const [otherHospital, setOtherHospital] = useState('');
  const [date, setDate] = useState('');
  const [cause, setCause] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, `https://picsum.photos/seed/${Math.random()}/300/300`]);
  };

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!patientName || !patientIdCard || patientIdCardFront.length === 0 || patientIdCardBack.length === 0 || !hospital || (hospital === 'other' && !otherHospital) || !date || !cause) {
      setError('请填写意向医院、日期及病因描述，并上传患者身份证正反面照片');
      return;
    }
    setLoading(true);
    
    const finalHospitalName = hospital === 'other' ? otherHospital : (MOCK_HOSPITALS.find(h => h.id === hospital)?.name || '');

    setTimeout(() => {
      addInpatientApp({
        id: 'I' + Date.now().toString().slice(-4),
        userId: user!.id,
        userName: user!.name!,
        patientName,
        patientIdCard,
        patientIdCardFront: patientIdCardFront[0],
        patientIdCardBack: patientIdCardBack[0],
        hospitalName: finalHospitalName,
        date,
        cause,
        status: '待确认',
        createdAt: new Date().toISOString(),
        images
      });
      setCurrentView('my');
      setLoading(false);
    }, 1000);
  };

  const renderUploadBox = (title: string, required: boolean, imgList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
    <div className="mb-4">
      <p className="text-[10px] font-bold text-slate-500 mb-2">{title} {required && <span className="text-red-500">*</span>}</p>
      <div className="flex flex-wrap gap-2">
        {imgList.map((img, i) => (
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
      <Header title="住院报备" backTo="home" />
      
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="bg-purple-50 text-purple-800 p-3 rounded-xl flex items-start mb-6">
          <AlertCircle className="shrink-0 mr-2 mt-0.5 text-purple-600" size={16} />
          <p className="text-[10px] leading-relaxed font-medium">提前报备住院由北医协调确认，安排挂账结算，无需垫付大额费用。</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">就诊队员姓名 *</label>
            <input 
              type="text" 
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="请输入队员姓名"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">身份证号 *</label>
            <input 
              type="text" 
              value={patientIdCard}
              onChange={(e) => setPatientIdCard(e.target.value)}
              placeholder="请输入队员身份证号"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300"
            />
          </div>
          
          <div className="mb-4">
            {renderUploadBox('队员身份证正面', true, patientIdCardFront, setPatientIdCardFront)}
            <div className="mt-2"></div>
            {renderUploadBox('队员身份证反面', true, patientIdCardBack, setPatientIdCardBack)}
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">意向医院 *</label>
            <select 
              value={hospital} 
              onChange={(e) => setHospital(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300 mb-2"
            >
              <option value="">请选择意向医院</option>
              {MOCK_HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              <option value="other">其他医院 (手动输入)</option>
            </select>
            {hospital === 'other' && (
              <input 
                type="text" 
                value={otherHospital}
                onChange={(e) => setOtherHospital(e.target.value)}
                placeholder="请输入医院全称"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300"
              />
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">预计住院日期</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300"
            />
          </div>

          <div>
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">病因描述</label>
             <textarea 
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="请简要描述医生建议住院的原因..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300 resize-none"
             ></textarea>
          </div>
        </div>

        <div className="mb-6">
          {renderUploadBox('住院通知单', false, images, setImages)}
        </div>

        {error && <p className="text-red-500 text-xs font-medium mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold text-sm py-3.5 rounded-xl active:bg-purple-700 transition-colors disabled:opacity-70 shadow-lg shadow-purple-200"
        >
          {loading ? '提交中...' : '提交申请'}
        </button>
      </div>
    </div>
  );
}

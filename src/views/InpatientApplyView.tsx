import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../store';
import { submitInpatientAppService, resubmitInpatientAppService } from '../api/c_end_service';
import { Header } from '../components/Header';
import { Camera, X, AlertCircle } from 'lucide-react';
import { MOCK_HOSPITALS } from '../mockData';

export function InpatientApplyView() {
  const { user, inpatientApps, addInpatientApp, updateInpatientApp, setCurrentView, viewProps } = useAppStore();
  const editApp = React.useMemo(() => inpatientApps.find(a => a.id === viewProps?.editId), [inpatientApps, viewProps?.editId]);

  // Determine initial hospital matching logic
  let initialHospital = '';
  let initialOtherHospital = '';
  if (editApp?.hospitalName) {
    const matched = MOCK_HOSPITALS.find(h => h.name === editApp.hospitalName);
    if (matched) {
      initialHospital = matched.id;
    } else {
      initialHospital = 'other';
      initialOtherHospital = editApp.hospitalName;
    }
  }

  const [patientName, setPatientName] = useState(editApp?.patientName || user?.name || '');
  const [patientIdCard, setPatientIdCard] = useState(editApp?.patientIdCard || user?.idCard || '');
  const [patientIdCardFront, setPatientIdCardFront] = useState<string[]>(editApp?.patientIdCardFront ? [editApp.patientIdCardFront] : (user?.idCardFront ? [user.idCardFront] : []));
  const [patientIdCardBack, setPatientIdCardBack] = useState<string[]>(editApp?.patientIdCardBack ? [editApp.patientIdCardBack] : (user?.idCardBack ? [user.idCardBack] : []));
  
  const [hospital, setHospital] = useState(initialHospital);
  const [otherHospital, setOtherHospital] = useState(initialOtherHospital);
  const [department, setDepartment] = useState(editApp?.department || '');
  const [date, setDate] = useState(editApp?.date || '');
  const [cause, setCause] = useState(editApp?.cause || '');
  const [images, setImages] = useState<string[]>(editApp?.images || []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, `https://picsum.photos/seed/${Math.random()}/300/300`]);
  };

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!patientName || !patientIdCard || patientIdCardFront.length === 0 || patientIdCardBack.length === 0 || !hospital || (hospital === 'other' && !otherHospital) || !date || !cause) {
      setError('请填写意向医院、日期及病因描述，并上传患者身份证正反面照片');
      return;
    }
    setLoading(true);
    
    const finalHospitalName = hospital === 'other' ? otherHospital : (MOCK_HOSPITALS.find(h => h.id === hospital)?.name || '');

        try {
      const appData = {
        userId: user!.id,
        userName: user!.name!,
        patientName,
        patientIdCard,
        patientIdCardFront: patientIdCardFront[0],
        patientIdCardBack: patientIdCardBack[0],
        hospitalName: finalHospitalName,
        department,
        date,
        cause,
        images
      };

      if (editApp) {
        await resubmitInpatientAppService(editApp.id, appData);
        updateInpatientApp(editApp.id, { ...appData, status: '待确认' });
      } else {
        const newApp = await submitInpatientAppService(appData as any);
        addInpatientApp(newApp);
      }
      setCurrentView('my');
    } catch (err: any) {
      setError(err.message || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  const renderUploadBox = (title: string, required: boolean, imgList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
    <div className="mb-4">
      <p className="text-[10px] font-bold text-slate-500 mb-2">{title} {required && <span className="text-red-500">*</span>}</p>
      <div className="flex flex-wrap gap-2">
        {imgList.map((img, i) => (
          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100">
            <img src={img} alt="upload" className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewImage(img)} />
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
              {MOCK_HOSPITALS.slice().sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance)).map(h => <option key={h.id} value={h.id}>{h.name} ({h.distance})</option>)}
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
            <div className="mt-4">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="就诊科室 (选填)"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-300"
              />
            </div>
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

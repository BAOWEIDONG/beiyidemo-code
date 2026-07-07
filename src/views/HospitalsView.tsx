import { useState } from 'react';
import { MOCK_HOSPITALS } from '../mockData';
import { Search as SearchIcon, MapPin, Phone, Map, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';

export function HospitalsView() {
  const { setCurrentView } = useAppStore();
  const [search, setSearch] = useState('');
  const [isMap, setIsMap] = useState(false);
  const [selectedMapHospital, setSelectedMapHospital] = useState<any>(null);
  const [city, setCity] = useState('北京');
  
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; phone: string}>({isOpen: false, phone: ''});

  const cities = ['北京', '上海', '广州', '深圳', '成都'];

  const filtered = MOCK_HOSPITALS.filter(h => 
    h.city === city &&
    (h.name.includes(search) || h.departments.some(d => d.includes(search)))
  ).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      
            <div className="bg-white px-4 pt-8 pb-3 shrink-0 z-30 sticky top-0 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => isMap ? setIsMap(false) : setCurrentView('home')} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-base font-bold text-slate-800">{isMap ? '医院详情' : '可用医院清单'}</h2>
        </div>
        {!isMap ? (
          <>
            <div className="flex gap-4 overflow-x-auto no-scrollbar mb-4">
              {cities.map(c => (
                <button 
                  key={c}
                  onClick={() => setCity(c)}
                  className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${city === c ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="搜索医院名称或科室..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-100 rounded-lg py-2.5 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
              />
            </div>
          </>
        ) : (
          <div className="pb-2">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedMapHospital?.name}</h3>
            <div 
              className="flex items-start text-slate-500 cursor-pointer active:text-blue-600 transition-colors"
              onClick={() => {
                if (selectedMapHospital?.address) {
                  const to = encodeURIComponent(selectedMapHospital.address);
                  window.location.href = 'https://uri.amap.com/navigation?to=' + to;
                }
              }}
            >
              <MapPin size={14} className="mr-1 mt-0.5 shrink-0" />
              <span className="text-xs leading-relaxed underline decoration-slate-300 underline-offset-2">{selectedMapHospital?.address}</span>
            </div>
            {selectedMapHospital?.phone && (
              <div 
                className="flex items-center text-slate-500 mt-1.5 cursor-pointer active:text-blue-600 transition-colors"
                onClick={() => {
                  if (selectedMapHospital?.phone) {
                    window.location.href = 'tel:' + selectedMapHospital.phone;
                  }
                }}
              >
                <Phone size={14} className="mr-1 shrink-0" />
                <span className="text-xs underline decoration-slate-300 underline-offset-2">{selectedMapHospital.phone}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 p-4">
        {isMap ? (
          <div className="w-full h-[65vh] bg-slate-100 rounded-2xl flex flex-col relative overflow-hidden border border-slate-200">
             <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=800&fit=crop')] bg-cover opacity-90 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
               <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 z-10 -mt-10 flex flex-col items-center">
                 <MapPin size={24} className="text-blue-600 mb-1" />
                 <p className="text-xs font-bold text-slate-800">{selectedMapHospital?.name || '目标位置'}</p>
                 <p className="text-[10px] text-slate-500 mt-1">模拟导航地图</p>
               </div>
             </div>
             <div className="p-4 bg-white border-t border-slate-100 flex gap-3 z-10 relative shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
               <button
                  onClick={() => {
                    const to = selectedMapHospital ? encodeURIComponent(selectedMapHospital.address) : '';
                    window.location.href = 'https://uri.amap.com/navigation?to=' + to;
                 }}
                 className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 active:bg-blue-700 transition-colors"
               >
                 <MapPin size={16} /> 去导航
               </button>
               <button
                  onClick={() => {
                    if (selectedMapHospital?.address) {
                      navigator.clipboard.writeText(selectedMapHospital.address).catch(() => {});
                      alert('已复制医院地址: ' + selectedMapHospital.address);
                    } else {
                      alert('医院地址已复制');
                    }
                 }}
                 className="flex-1 py-3 bg-slate-100 text-slate-800 text-sm font-bold rounded-xl active:bg-slate-200 transition-colors"
               >
                 复制地址
               </button>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((hospital, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={hospital.id} 
                onClick={() => { setSelectedMapHospital(hospital); setIsMap(true); }}
                className={`p-4 bg-white border rounded-2xl shadow-sm cursor-pointer ${index === 0 ? 'border-blue-100' : 'border-slate-100 opacity-90'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-sm font-bold text-slate-800">{hospital.name}</h5>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 text-[10px] rounded bg-blue-50 text-blue-600">{hospital.level}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-50 text-indigo-600">{hospital.cooperationType}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">{hospital.address}</p>
                
                {hospital.departments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hospital.departments.slice(0,3).map(dept => (
                      <span key={dept} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">{dept}</span>
                    ))}
                    {hospital.departments.length > 3 && <span className="text-[9px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded">...</span>}
                  </div>
                )}

                <div className="flex gap-2 items-center pt-3 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 italic">距离 {hospital.distance}</span>
                  <div className="flex-1"></div>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setConfirmDialog({ isOpen: true, phone: hospital.phone });
                    }} 
                    className="p-1.5 text-slate-500 bg-slate-50 rounded-full active:bg-slate-100"
                  >
                    <Phone size={14} />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                       setSelectedMapHospital(hospital);
                      setIsMap(true); 
                    }} 
                    className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-full shadow-md shadow-slate-200"
                  >
                    导航
                  </button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-slate-500 py-10 text-xs">
                当前城市未找到匹配的医院
              </div>
            )}
          </div>
        )}
      </div>

      

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">提示</h3>
            <p className="text-sm text-slate-600 mb-6">拨打医院电话: {confirmDialog.phone}?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, phone: '' })}
                className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  window.location.href = `tel:${confirmDialog.phone}`;
                  setConfirmDialog({ isOpen: false, phone: '' });
                }}
                className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl"
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

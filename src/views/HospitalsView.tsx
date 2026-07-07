import { useState } from 'react';
import { MOCK_HOSPITALS } from '../mockData';
import { Search as SearchIcon, MapPin, Phone, Map, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store';

export function HospitalsView() {
  const { setCurrentView } = useAppStore();
  const [search, setSearch] = useState('');
  const [isMap, setIsMap] = useState(false);
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
          <button onClick={() => setCurrentView('home')} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-base font-bold text-slate-800">可用医院清单</h2>
        </div>

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
      </div>

      <div className="flex-1 p-4">
        {isMap ? (
          <div className="w-full h-[65vh] bg-slate-100 rounded-2xl flex items-center justify-center flex-col relative overflow-hidden border border-slate-200">
             <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Beijing&zoom=11&size=600x600&sensor=false')] bg-cover opacity-30 mix-blend-luminosity grayscale"></div>
             <MapPin size={32} className="text-blue-600 relative z-10 mb-2 drop-shadow-md" />
             <p className="text-slate-800 font-bold relative z-10">已调用地图组件</p>
             <p className="text-slate-500 text-xs relative z-10 mt-1 mb-4">展示附近定点医院</p>
             <div className="flex gap-2 relative z-10">
               <button 
                 onClick={() => {
                    alert('正在拉起第三方导航软件...');
                 }}
                 className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md"
               >
                 去导航
               </button>
               <button 
                 onClick={() => {
                    alert('地址已复制到剪贴板，请前往地图软件粘贴。');
                 }}
                 className="px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-full shadow-md border border-slate-200"
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
                onClick={() => { setIsMap(true); }}
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

      <div className="p-4 bg-white shrink-0 sticky bottom-0 border-t border-slate-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setIsMap(!isMap)}
          className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:bg-slate-200 transition-colors"
        >
          {isMap ? <SearchIcon size={16} /> : <Map size={16} />}
          {isMap ? '返回列表视图' : '地图模式查看附近'}
        </button>
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

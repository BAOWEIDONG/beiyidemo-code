import { ChevronLeft } from 'lucide-react';
import { useAppStore } from '../store';

export function Header({ title, backTo, onBack }: { title: string, backTo?: string, onBack?: () => void }) {
  const { setCurrentView } = useAppStore();
  
  return (
    <div className="sticky top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-slate-50 flex items-center h-14 px-4 pt-safe shrink-0">
      {(backTo || onBack) ? (
        <button 
          onClick={() => onBack ? onBack() : setCurrentView(backTo!)} 
          className="p-2 -ml-2 text-slate-800 active:bg-slate-50 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      ) : (
        <div className="w-10"></div>
      )}
      <h1 className="flex-1 text-center font-bold text-slate-800 text-base">{title}</h1>
      <div className="w-10"></div>
    </div>
  );
}

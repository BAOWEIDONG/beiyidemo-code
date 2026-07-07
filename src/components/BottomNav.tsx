import { Home, Search, User } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

export function BottomNav() {
  const { currentView, setCurrentView } = useAppStore();

  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'hospitals', label: '找医院', icon: Search },
    { id: 'my', label: '我的', icon: User },
  ];

  if (!['home', 'hospitals', 'my'].includes(currentView)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around pb-safe z-50">
      <div className="w-full max-w-md mx-auto flex justify-around h-14 items-center px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={cn(
                "flex flex-col items-center transition-colors",
                isActive ? "text-blue-600" : "text-slate-400"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppStore, AppProvider } from './store';
import { LoginView } from './views/LoginView';

import { HomeView } from './views/HomeView';
import { HospitalsView } from './views/HospitalsView';
import { ClaimApplyView } from './views/ClaimApplyView';
import { InpatientApplyView } from './views/InpatientApplyView';
import { MyRecordsView } from './views/MyRecordsView';
import { ReviewWorkBenchView } from './views/ReviewWorkBenchView';
import { BottomNav } from './components/BottomNav';

function AppContent() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'login': return <LoginView />;
      
      case 'home': return <HomeView />;
      case 'hospitals': return <HospitalsView />;
      case 'claimApply': return <ClaimApplyView />;
      case 'inpatientApply': return <InpatientApplyView />;
      case 'my': return <MyRecordsView />;
      case 'reviewWorkbench': return <ReviewWorkBenchView />;
      default: return <LoginView />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen relative shadow-2xl sm:border-x border-slate-200 overflow-x-hidden flex flex-col">
      {renderView()}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}


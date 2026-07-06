import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Claim, InpatientApp } from './types';

interface AppState {
  user: User | null;
  claims: Claim[];
  inpatientApps: InpatientApp[];
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
  setClaims: (claims: Claim[]) => void;
  setInpatientApps: (apps: InpatientApp[]) => void;
  addClaim: (claim: Claim) => void;
  updateClaim: (id: string, data: Partial<Claim>) => void;
  addInpatientApp: (app: InpatientApp) => void;
  updateInpatientApp: (id: string, data: Partial<InpatientApp>) => void;
  currentView: string;
  setCurrentView: (view: string, props?: any) => void;
  viewProps: any;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [inpatientApps, setInpatientApps] = useState<InpatientApp[]>([]);
  const [currentView, setCurrentView] = useState('login');
  const [viewProps, setViewProps] = useState<any>({});

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  };

  const addClaim = (claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
  };

  const updateClaim = (id: string, data: Partial<Claim>) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const addInpatientApp = (app: InpatientApp) => {
    setInpatientApps((prev) => [app, ...prev]);
  };

  const updateInpatientApp = (id: string, data: Partial<InpatientApp>) => {
    setInpatientApps(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const handleSetView = (view: string, props?: any) => {
    setCurrentView(view);
    setViewProps(props || {});
  }

  return (
    <AppContext.Provider value={{
      user, setUser, updateUser,
      claims, setClaims, addClaim, updateClaim,
      inpatientApps, setInpatientApps, addInpatientApp, updateInpatientApp,
      currentView, setCurrentView: handleSetView, viewProps
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}

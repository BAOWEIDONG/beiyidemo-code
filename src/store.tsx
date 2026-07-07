import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Claim, InpatientApp } from './types';

interface AppState {
  user: User | null;
  claims: Claim[];
  inpatientApps: InpatientApp[];
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
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
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 'C1001',
      userId: 'u123',
      userName: '队医王',
      patientName: '张三',
      patientIdCard: '110105199001011111',
      patientIdCardFront: 'https://picsum.photos/200/120?id1',
      patientIdCardBack: 'https://picsum.photos/200/120?id2',
      hospitalName: '北京大学第三医院',
      date: '2026-06-25',
      type: '门诊',
      status: '待审核',
      amount: 428.5,
      createdAt: '2026-06-26T10:00:00Z',
      payeeName: '张三',
      payeeAccount: '6222021001112222',
      payeeBank: '工商银行',
      images: { invoice: ['https://picsum.photos/200/300?1'], record: ['https://picsum.photos/200/300?1r'], cost: [], prescription: [], diagnosis: [] }
    },
    {
      id: 'C1002',
      userId: 'u123',
      userName: '队医王',
      patientName: '队医王',
      patientIdCard: '110105198001012222',
      patientIdCardFront: 'https://picsum.photos/200/120?id3',
      patientIdCardBack: 'https://picsum.photos/200/120?id4',
      hospitalName: '北京积水潭医院',
      date: '2026-06-20',
      type: '急诊',
      status: '已审核',
      amount: 1250.0,
      approvedAmount: 1250.0,
      createdAt: '2026-06-21T14:30:00Z',
      payeeName: '队医王',
      payeeAccount: '6222021001113333',
      payeeBank: '建设银行',
      images: { invoice: ['https://picsum.photos/200/300?2'], record: ['https://picsum.photos/200/300?2r'], cost: [], prescription: [], diagnosis: [] }
    },
    {
      id: 'C1003',
      userId: 'u123',
      userName: '队医王',
      patientName: '李四',
      patientIdCard: '110105199501013333',
      patientIdCardFront: 'https://picsum.photos/200/120?id5',
      patientIdCardBack: 'https://picsum.photos/200/120?id6',
      hospitalName: '北京协和医院',
      date: '2026-06-15',
      type: '门诊',
      status: '已驳回',
      amount: 800.0,
      createdAt: '2026-06-16T09:00:00Z',
      rejectReason: '发票不清晰，请重新上传',
      payeeName: '李四',
      payeeAccount: '6222021001114444',
      payeeBank: '农业银行',
      images: { invoice: ['https://picsum.photos/200/300?3'], record: ['https://picsum.photos/200/300?3r'], cost: [], prescription: [], diagnosis: [] }
    },
    {
      id: 'C1004',
      userId: 'u123',
      userName: '队医王',
      patientName: '队医王',
      patientIdCard: '110105198001012222',
      patientIdCardFront: 'https://picsum.photos/200/120?id3',
      patientIdCardBack: 'https://picsum.photos/200/120?id4',
      hospitalName: '北京天坛医院',
      date: '2026-06-10',
      type: '门诊',
      status: '已撤销',
      amount: 300.0,
      createdAt: '2026-06-11T10:00:00Z',
      payeeName: '队医王',
      payeeAccount: '6222021001113333',
      payeeBank: '建设银行',
      images: { invoice: ['https://picsum.photos/200/300?4'], record: ['https://picsum.photos/200/300?4r'], cost: [], prescription: [], diagnosis: [] }
    }
  ]);
  const [inpatientApps, setInpatientApps] = useState<InpatientApp[]>([
    {
      id: 'I2001',
      userId: 'u123',
      userName: '队医王',
      patientName: '王五',
      patientIdCard: '110105199601015555',
      patientIdCardFront: 'https://picsum.photos/200/120?id7',
      patientIdCardBack: 'https://picsum.photos/200/120?id8',
      hospitalName: '北京大学第三医院',
      date: '2026-07-10',
      cause: '前交叉韧带断裂重建',
      status: '待确认',
      createdAt: '2026-06-29T10:00:00Z',
      images: ['https://picsum.photos/200/300?5']
    },
    {
      id: 'I2002',
      userId: 'u123',
      userName: '队医王',
      patientName: '赵六',
      patientIdCard: '110105199801016666',
      patientIdCardFront: 'https://picsum.photos/200/120?id9',
      patientIdCardBack: 'https://picsum.photos/200/120?id10',
      hospitalName: '北京积水潭医院',
      date: '2026-06-25',
      cause: '半月板损伤修复',
      status: '已确认',
      createdAt: '2026-06-20T10:00:00Z',
      images: ['https://picsum.photos/200/300?6']
    },
    {
      id: 'I2003',
      userId: 'u123',
      userName: '队医王',
      patientName: '队医王',
      patientIdCard: '110105198001012222',
      patientIdCardFront: 'https://picsum.photos/200/120?id3',
      patientIdCardBack: 'https://picsum.photos/200/120?id4',
      hospitalName: '北京积水潭医院',
      date: '2026-06-15',
      cause: '关节镜检查',
      status: '已驳回',
      rejectReason: '非定点医院，请联系北医确认',
      createdAt: '2026-06-10T10:00:00Z',
      images: ['https://picsum.photos/200/300?7']
    },
    {
      id: 'I2004',
      userId: 'u123',
      userName: '队医王',
      patientName: '孙七',
      patientIdCard: '110105199901017777',
      patientIdCardFront: 'https://picsum.photos/200/120?id11',
      patientIdCardBack: 'https://picsum.photos/200/120?id12',
      hospitalName: '北京大学第三医院',
      date: '2026-06-05',
      cause: '肩袖损伤',
      status: '已撤销',
      createdAt: '2026-06-01T10:00:00Z',
      images: ['https://picsum.photos/200/300?8']
    }
  ]);
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
      claims, addClaim, updateClaim,
      inpatientApps, addInpatientApp, updateInpatientApp,
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

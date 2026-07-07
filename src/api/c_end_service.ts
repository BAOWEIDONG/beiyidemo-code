import { Claim, InpatientApp, User } from '../types';

// ====== Mock Data ======
let mockClaims: Claim[] = [
  {
    id: 'M2026071500010001',
    userId: 'u123',
    userName: '队医王',
    patientName: '李铁',
    patientIdCard: '110105199001011111',
    patientIdCardFront: 'https://picsum.photos/200/120?id1',
    patientIdCardBack: 'https://picsum.photos/200/120?id2',
    hospitalName: '北京大学第三医院',
    date: '2026-07-01',
    type: '门诊',
    status: '待审核',
    amount: 580.5,
    createdAt: '2026-07-02T10:00:00Z',
    payeeName: '李铁',
    payeeAccount: '6222021001112222',
    payeeBank: '工商银行',
    images: { invoice: ['https://picsum.photos/200/300?1'], record: ['https://picsum.photos/200/300?1r'], cost: [], prescription: [], diagnosis: [] }
  },
  {
    id: 'M2026071500010002',
    userId: 'u123',
    userName: '队医王',
    patientName: '孙雯',
    patientIdCard: '110105199001011112',
    patientIdCardFront: 'https://picsum.photos/200/120?id1',
    patientIdCardBack: 'https://picsum.photos/200/120?id2',
    hospitalName: '北京积水潭医院',
    date: '2026-06-25',
    type: '急诊',
    status: '已审核',
    amount: 1500.0,
    approvedAmount: 1500.0,
    createdAt: '2026-06-26T09:00:00Z',
    completedAt: '2026-06-27T14:30:00Z',
    payeeName: '孙雯',
    payeeAccount: '6222021001112233',
    payeeBank: '建设银行',
    images: { invoice: ['https://picsum.photos/200/300?2'], record: ['https://picsum.photos/200/300?2r'], cost: [], prescription: [], diagnosis: [] },
    auditHistory: [
      {
        id: 'a1',
        claimId: 'M2026071500010002',
        reviewerId: 'admin2',
        reviewerName: '保险管理员',
        reviewLevel: '保险审核',
        approvedAmount: 1500.0,
        status: '通过',
        feedback: '审核通过，已触发打款',
        reviewTime: '2026-06-27T14:30:00Z'
      }
    ]
  },
  {
    id: 'M2026071500010003',
    userId: 'u123',
    userName: '队医王',
    patientName: '王霜',
    patientIdCard: '110105199501011113',
    patientIdCardFront: 'https://picsum.photos/200/120?id5',
    patientIdCardBack: 'https://picsum.photos/200/120?id6',
    hospitalName: '北京协和医院',
    date: '2026-06-15',
    type: '门诊',
    status: '已驳回',
    amount: 800.0,
    createdAt: '2026-06-16T09:00:00Z',
    completedAt: '2026-06-16T11:30:00Z',
    rejectReason: '发票照片模糊无法识别，请重新上传清晰的发票照片',
    payeeName: '王霜',
    payeeAccount: '6222021001114444',
    payeeBank: '农业银行',
    images: { invoice: ['https://picsum.photos/200/300?3'], record: ['https://picsum.photos/200/300?3r'], cost: [], prescription: [], diagnosis: [] },
    auditHistory: [
      {
        id: 'a2',
        claimId: 'M2026071500010003',
        reviewerId: 'admin2',
        reviewerName: '保险管理员',
        reviewLevel: '保险审核',
        status: '驳回',
        feedback: '发票照片模糊无法识别，请重新上传清晰的发票照片',
        reviewTime: '2026-06-16T11:30:00Z'
      }
    ]
  },
  {
    id: 'M2026071500010004',
    userId: 'u123',
    userName: '队医王',
    patientName: '郑智',
    patientIdCard: '110105198001011114',
    patientIdCardFront: 'https://picsum.photos/200/120?id3',
    patientIdCardBack: 'https://picsum.photos/200/120?id4',
    hospitalName: '北京天坛医院',
    date: '2026-06-10',
    type: '门诊',
    status: '已撤销',
    amount: 300.0,
    createdAt: '2026-06-11T10:00:00Z',
    payeeName: '郑智',
    payeeAccount: '6222021001113333',
    payeeBank: '招商银行',
    images: { invoice: ['https://picsum.photos/200/300?4'], record: ['https://picsum.photos/200/300?4r'], cost: [], prescription: [], diagnosis: [] }
  },
  {
    id: 'M2026071500010005',
    userId: 'u123',
    userName: '队医王',
    patientName: '吴磊',
    patientIdCard: '110105199101011115',
    patientIdCardFront: 'https://picsum.photos/200/120?id5',
    patientIdCardBack: 'https://picsum.photos/200/120?id6',
    hospitalName: '北京大学第三医院',
    date: '2026-07-03',
    type: '门诊',
    status: '待审核',
    amount: 120.0,
    createdAt: '2026-07-04T08:30:00Z',
    payeeName: '吴磊',
    payeeAccount: '6222021001115555',
    payeeBank: '交通银行',
    images: { invoice: ['https://picsum.photos/200/300?5'], record: ['https://picsum.photos/200/300?5r'], cost: [], prescription: [], diagnosis: [] }
  },
  {
    id: 'M2026071500010006',
    userId: 'u123',
    userName: '队医王',
    patientName: '张玉宁',
    patientIdCard: '110105199701011116',
    patientIdCardFront: 'https://picsum.photos/200/120?id7',
    patientIdCardBack: 'https://picsum.photos/200/120?id8',
    hospitalName: '北京协和医院',
    date: '2026-06-05',
    type: '急诊',
    status: '已审核',
    amount: 3200.0,
    approvedAmount: 3200.0,
    createdAt: '2026-06-06T14:20:00Z',
    completedAt: '2026-06-07T11:15:00Z',
    payeeName: '张玉宁',
    payeeAccount: '6222021001116666',
    payeeBank: '中信银行',
    images: { invoice: ['https://picsum.photos/200/300?6'], record: ['https://picsum.photos/200/300?6r'], cost: [], prescription: [], diagnosis: [] },
    auditHistory: [
      {
        id: 'a3',
        claimId: 'M2026071500010006',
        reviewerId: 'admin2',
        reviewerName: '保险管理员',
        reviewLevel: '保险审核',
        approvedAmount: 3200.0,
        status: '通过',
        feedback: '资料齐全，同意赔付',
        reviewTime: '2026-06-07T11:15:00Z'
      }
    ]
  }
];

let mockInpatientApps: InpatientApp[] = [
  {
    id: 'Z2026071400010001',
    userId: 'u123',
    userName: '队医王',
    patientName: '李铁',
    patientIdCard: '110105199001011111',
    patientIdCardFront: 'https://picsum.photos/200/120?id7',
    patientIdCardBack: 'https://picsum.photos/200/120?id8',
    hospitalName: '北京大学第三医院',
    date: '2026-07-20',
    cause: '前交叉韧带断裂重建',
    status: '待确认',
    createdAt: '2026-07-05T10:00:00Z',
    images: ['https://picsum.photos/200/300?5']
  },
  {
    id: 'Z2026071400010002',
    userId: 'u123',
    userName: '队医王',
    patientName: '孙雯',
    patientIdCard: '110105199001011112',
    patientIdCardFront: 'https://picsum.photos/200/120?id9',
    patientIdCardBack: 'https://picsum.photos/200/120?id10',
    hospitalName: '北京积水潭医院',
    date: '2026-07-15',
    cause: '半月板损伤修复',
    status: '已确认',
    createdAt: '2026-07-01T10:00:00Z',
    completedAt: '2026-07-02T14:30:00Z',
    images: ['https://picsum.photos/200/300?6'],
    auditHistory: [
      {
        id: 'a4',
        claimId: 'Z2026071400010002',
        reviewerId: 'admin1',
        reviewerName: '北医管理员',
        reviewLevel: '北医审核',
        status: '确认',
        feedback: '情况属实，已安排垫付挂账',
        reviewTime: '2026-07-02T14:30:00Z'
      }
    ]
  },
  {
    id: 'Z2026071400010003',
    userId: 'u123',
    userName: '队医王',
    patientName: '王霜',
    patientIdCard: '110105199501011113',
    patientIdCardFront: 'https://picsum.photos/200/120?id3',
    patientIdCardBack: 'https://picsum.photos/200/120?id4',
    hospitalName: '北京协和医院',
    date: '2026-06-25',
    cause: '关节镜检查',
    status: '已驳回',
    rejectReason: '该医院暂不支持直接挂账，请先自费后走门急诊理赔',
    createdAt: '2026-06-20T10:00:00Z',
    completedAt: '2026-06-21T09:15:00Z',
    images: ['https://picsum.photos/200/300?7'],
    auditHistory: [
      {
        id: 'a5',
        claimId: 'Z2026071400010003',
        reviewerId: 'admin1',
        reviewerName: '北医管理员',
        reviewLevel: '北医审核',
        status: '驳回',
        feedback: '该医院暂不支持直接挂账，请先自费后走门急诊理赔',
        reviewTime: '2026-06-21T09:15:00Z'
      }
    ]
  },
  {
    id: 'Z2026071400010004',
    userId: 'u123',
    userName: '队医王',
    patientName: '郑智',
    patientIdCard: '110105198001011114',
    patientIdCardFront: 'https://picsum.photos/200/120?id11',
    patientIdCardBack: 'https://picsum.photos/200/120?id12',
    hospitalName: '北京大学第三医院',
    date: '2026-06-05',
    cause: '肩袖损伤',
    status: '已撤销',
    createdAt: '2026-06-01T10:00:00Z',
    images: ['https://picsum.photos/200/300?8']
  },
  {
    id: 'Z2026071400010005',
    userId: 'u123',
    userName: '队医王',
    patientName: '吴磊',
    patientIdCard: '110105199101011115',
    patientIdCardFront: 'https://picsum.photos/200/120?id1',
    patientIdCardBack: 'https://picsum.photos/200/120?id2',
    hospitalName: '北京积水潭医院',
    date: '2026-08-01',
    cause: '跟腱断裂手术',
    status: '待确认',
    createdAt: '2026-07-06T15:00:00Z',
    images: ['https://picsum.photos/200/300?9']
  }
];

// ====== API Services ======

export interface LoginParams {
  phone: string;
  code: string;
  loginRole: string;
}

export const loginService = async (params: LoginParams): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { phone, code, loginRole } = params;
      if (code.length !== 6) {
        return reject(new Error('验证码错误，请输入6位验证码'));
      }
      const validPhones = ['13800138000', '13900139000'];
      if (loginRole === 'user' && !validPhones.includes(phone)) {
        return reject(new Error('该队员不存在，请联系管理员核实'));
      }
      let usedLimit = 4500;
      if (loginRole === 'user') {
        const userId = 'u123';
        usedLimit = mockClaims
          .filter(c => c.userId === userId && c.status === '已审核')
          .reduce((sum, c) => sum + (c.approvedAmount || c.amount || 0), 0);
        // Base used limit from history if we want
        usedLimit += 1300; // just to keep the mock visual if needed, or 0. Let's make it calculate correctly:
      }
      const totalLimit = 50000;
      
      resolve({
        id: loginRole === 'user' ? 'u123' : 'admin_' + Date.now(),
        phone: phone,
        verified: loginRole !== 'user',
        verifyStatus: loginRole !== 'user' ? 'verified' : 'unverified',
        role: loginRole as any,
        name: loginRole === 'beiyi_admin' ? '北医管理员' : loginRole === 'insurance_admin' ? '保险审核员' : '队医王',
        insuranceCompany: '平安保险',
        insuranceBatch: '2026年度集训险',
        validFrom: '2026-01-01',
        validUntil: '2026-12-31',
        totalLimit: totalLimit,
        usedLimit: usedLimit,
        remainingLimit: totalLimit - usedLimit,
        insuranceStatus: 'active'
      });
    }, 800);
  });
};

export const fetchClaimsService = async (userId: string): Promise<Claim[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...mockClaims]), 600));
};

export const fetchInpatientAppsService = async (userId: string): Promise<InpatientApp[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...mockInpatientApps]), 600));
};

export const submitClaimService = async (data: Omit<Claim, 'id' | 'status' | 'createdAt'>): Promise<Claim> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClaim: Claim = {
        ...data,
        id: 'M' + Date.now(),
        status: '待审核',
        createdAt: new Date().toISOString()
      };
      mockClaims = [newClaim, ...mockClaims];
      resolve(newClaim);
    }, 1000);
  });
};

export const submitInpatientAppService = async (data: Omit<InpatientApp, 'id' | 'status' | 'createdAt'>): Promise<InpatientApp> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newApp: InpatientApp = {
        ...data,
        id: 'Z' + Date.now(),
        status: '待确认',
        createdAt: new Date().toISOString()
      };
      mockInpatientApps = [newApp, ...mockInpatientApps];
      resolve(newApp);
    }, 1000);
  });
};

export const cancelClaimService = async (claimId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockClaims = mockClaims.map(c => c.id === claimId ? { ...c, status: '已撤销' } : c);
      resolve();
    }, 800);
  });
};

export const cancelInpatientAppService = async (appId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockInpatientApps = mockInpatientApps.map(a => a.id === appId ? { ...a, status: '已撤销' } : a);
      resolve();
    }, 800);
  });
};

export const reviewClaimService = async (claimId: string, action: 'approve' | 'reject', data: any): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => {
    mockClaims = mockClaims.map(c => c.id === claimId ? { ...c, ...data } : c);
    resolve();
  }, 800));
};

export const reviewInpatientAppService = async (appId: string, action: 'approve' | 'reject', data: any): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => {
    mockInpatientApps = mockInpatientApps.map(a => a.id === appId ? { ...a, ...data } : a);
    resolve();
  }, 800));
};

export const resubmitClaimService = async (claimId: string, data: Partial<Claim>): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => {
    mockClaims = mockClaims.map(c => c.id === claimId ? { ...c, ...data, status: '待审核' } : c);
    resolve();
  }, 800));
};

export const resubmitInpatientAppService = async (appId: string, data: Partial<InpatientApp>): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => {
    mockInpatientApps = mockInpatientApps.map(a => a.id === appId ? { ...a, ...data, status: '待确认' } : a);
    resolve();
  }, 800));
};

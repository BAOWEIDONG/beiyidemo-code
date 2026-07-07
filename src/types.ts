export type Role = 'user' | 'beiyi_admin' | 'insurance_admin' | 'super_admin';

export type User = {
  id: string;
  phone: string;
  name?: string;
  idCard?: string;
  verified: boolean;
  verifyStatus?: 'unverified' | 'pending' | 'rejected' | 'approved';
  idCardFront?: string;
  idCardBack?: string;
  verifyRejectReason?: string;
  
  insuranceStatus?: 'active' | 'inactive';
  insuranceBatch?: string;
  insuranceCompany?: string;
  validFrom?: string;
  validUntil?: string;
  totalLimit?: number;
  usedLimit?: number;
  remainingLimit?: number;
  
  role: Role;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  distance: string;
  city: string;
  departments: string[];
  phone: string;
  level: string;
  cooperationType: string;
  lat?: number;
  lng?: number;
};

export type AuditRecord = {
  id: string;
  claimId: string;
  reviewerId: string;
  reviewerName: string;
  reviewLevel: string;
  approvedAmount?: number;
  status: '通过' | '驳回' | '确认';
  feedback?: string;
  reviewTime: string;
};

export type Claim = {
  id: string;
  userId: string;
  userName: string;
  patientName: string;
  patientIdCard?: string;
  patientIdCardFront?: string;
  patientIdCardBack?: string;
  hospitalName: string;
  department?: string;
  date: string;
  type: '门诊' | '急诊';
  status: '待审核' | '已审核' | '已撤销' | '已驳回';
  amount: number;
  approvedAmount?: number;
  createdAt: string;
  completedAt?: string;
  rejectReason?: string;
  requiredDocs?: string[];
  payeeName: string;
  payeeAccount: string;
  payeeBank: string;
  images: {
    invoice: string[];
    record: string[];
    cost: string[];
    prescription: string[];
    diagnosis: string[];
  };
  beiyiOpinion?: string;
  insuranceOpinion?: string;
  auditHistory?: AuditRecord[];
};

export type InpatientApp = {
  id: string;
  userId: string;
  userName: string;
  patientName: string;
  patientIdCard?: string;
  patientIdCardFront?: string;
  patientIdCardBack?: string;
  hospitalName: string;
  date: string;
  cause: string;
  status: '待确认' | '已确认' | '已撤销' | '已驳回';
  createdAt: string;
  completedAt?: string;
  rejectReason?: string;
  images: string[];
  auditHistory?: AuditRecord[];
};

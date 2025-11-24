// M_シフト (Shift Master)
export type ShiftType = '早出' | '日勤' | '遅出' | '夜勤' | '休み' | '有給';

export interface ShiftMaster {
  id: string;
  name: ShiftType;
  startTime: string;
  endTime: string;
  color: string;
  textColor: string;
}

// M_職員 (Staff Master)
export interface Staff {
  id: string;
  name: string;
  group: string[]; // CSV: 1,2,3...
  unit: string;
  role: string; // 役職
  isQualified: boolean; // 喀痰吸引資格者
  employmentType: '常勤' | '派遣' | 'パート';
  isAdmin: boolean;
  password?: string; // In real app, hashed
}

// T_シフト希望 (Shift Request)
export interface ShiftRequest {
  id: string;
  staffId: string;
  date: string; // yyyy-MM-dd
  note?: string;
  requestedShiftId?: string; // Usually '休み'
}

// T_イベント (Event)
export interface FacilityEvent {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  group: string[];
  description: string;
}

// T_シフト表詳細 (Shift Result)
export interface ShiftResult {
  id: string;
  date: string;
  staffId: string;
  shiftId: string;
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'REQUEST' | 'MANAGER' | 'STAFF' | 'EVENTS';

import { ShiftMaster, Staff, FacilityEvent, ShiftRequest, ShiftResult } from './types';

export const SHIFT_TYPES: ShiftMaster[] = [
  { id: 'S1', name: '早出', startTime: '07:00', endTime: '16:00', color: 'bg-orange-100', textColor: 'text-orange-800' },
  { id: 'S2', name: '日勤', startTime: '09:00', endTime: '18:00', color: 'bg-blue-100', textColor: 'text-blue-800' },
  { id: 'S3', name: '遅出', startTime: '11:00', endTime: '20:00', color: 'bg-green-100', textColor: 'text-green-800' },
  { id: 'S4', name: '夜勤', startTime: '16:30', endTime: '09:30', color: 'bg-purple-100', textColor: 'text-purple-800' },
  { id: 'S5', name: '休み', startTime: '-', endTime: '-', color: 'bg-slate-100', textColor: 'text-slate-500' },
];

export const MOCK_STAFF: Staff[] = [
  { id: 'U001', name: '佐藤 健一', group: ['1'], unit: 'さくら', role: 'リーダー', isQualified: true, employmentType: '常勤', isAdmin: true, password: 'admin' },
  { id: 'U002', name: '鈴木 花子', group: ['1'], unit: 'さくら', role: '職員', isQualified: true, employmentType: '常勤', isAdmin: false, password: 'user' },
  { id: 'U003', name: '田中 次郎', group: ['1'], unit: 'さくら', role: '職員', isQualified: false, employmentType: '常勤', isAdmin: false },
  { id: 'U004', name: '高橋 優子', group: ['1'], unit: 'さくら', role: 'パート', isQualified: false, employmentType: 'パート', isAdmin: false },
  { id: 'U005', name: '伊藤 翔太', group: ['1'], unit: 'さくら', role: '派遣', isQualified: true, employmentType: '派遣', isAdmin: false },
  { id: 'U006', name: '渡辺 さゆり', group: ['1'], unit: 'さくら', role: '職員', isQualified: true, employmentType: '常勤', isAdmin: false },
];

export const MOCK_EVENTS: FacilityEvent[] = [
  { id: 'E001', date: '2023-11-15', title: '避難訓練', group: ['1'], description: '14:00から実施' },
  { id: 'E002', date: '2023-11-20', title: '誕生日会', group: ['1'], description: '入居者様の誕生日会' },
];

// Pre-fill some requests
export const INITIAL_REQUESTS: ShiftRequest[] = [
  { id: 'R001', staffId: 'U002', date: '2023-11-10', requestedShiftId: 'S5' },
  { id: 'R002', staffId: 'U002', date: '2023-11-11', requestedShiftId: 'S5' },
];

// Helpers
export const CURRENT_YEAR = 2023;
export const CURRENT_MONTH = 11; // November

import React, { useState } from 'react';
import { Staff, ShiftRequest, FacilityEvent } from '../types';
import { SHIFT_TYPES, CURRENT_YEAR, CURRENT_MONTH } from '../constants';
import { ChevronLeft, ChevronRight, Save, Calendar as CalendarIcon, Info } from 'lucide-react';

interface ShiftRequestProps {
  currentUser: Staff;
  events: FacilityEvent[];
  existingRequests: ShiftRequest[];
  onSaveRequests: (requests: ShiftRequest[]) => void;
}

const ShiftRequestScreen: React.FC<ShiftRequestProps> = ({ currentUser, events, existingRequests, onSaveRequests }) => {
  // Simple state to track requests locally before "saving"
  const [requests, setRequests] = useState<ShiftRequest[]>(existingRequests.filter(r => r.staffId === currentUser.id));
  const [note, setNote] = useState('');

  const daysInMonth = new Date(CURRENT_YEAR, CURRENT_MONTH, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const toggleRequest = (day: number) => {
    const dateStr = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existingIndex = requests.findIndex(r => r.date === dateStr);

    if (existingIndex >= 0) {
      // Remove
      const newRequests = [...requests];
      newRequests.splice(existingIndex, 1);
      setRequests(newRequests);
    } else {
      // Add "Holiday" request
      const newReq: ShiftRequest = {
        id: Math.random().toString(36).substr(2, 9),
        staffId: currentUser.id,
        date: dateStr,
        requestedShiftId: 'S5' // 休み
      };
      setRequests([...requests, newReq]);
    }
  };

  const handleSave = () => {
    onSaveRequests(requests);
    alert('希望を提出しました。');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-teal-600" />
            {CURRENT_YEAR}年 {CURRENT_MONTH}月 シフト希望提出
          </h2>
          <p className="text-slate-500 mt-1">
            休みたい日付を選択してください。再度クリックすると解除されます。
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg shadow-sm font-medium transition-all"
        >
          <Save className="w-5 h-5 mr-2" />
          希望を提出する
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-slate-50 border-b">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
            <div key={day} className={`p-3 text-center text-sm font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-600'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
           {/* Empty cells for start of month (assuming starts on Wed for Nov 2023) */}
           {/* Simple static offset for demo: Nov 1st 2023 is Wednesday (Index 3) */}
           {[0, 1, 2].map(pad => <div key={`pad-${pad}`} className="bg-slate-50/50 border-b border-r min-h-[100px]" />)}

           {days.map(day => {
             const dateStr = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
             const isRequested = requests.some(r => r.date === dateStr);
             const event = events.find(e => e.date === dateStr);
             const isWeekend = new Date(CURRENT_YEAR, CURRENT_MONTH - 1, day).getDay() === 0;

             return (
               <div 
                 key={day} 
                 onClick={() => toggleRequest(day)}
                 className={`
                   relative min-h-[100px] border-b border-r p-2 cursor-pointer transition-colors hover:bg-slate-50
                   ${isRequested ? 'bg-orange-50' : ''}
                 `}
               >
                 <div className="flex justify-between items-start">
                   <span className={`text-sm font-semibold inline-block w-7 h-7 leading-7 text-center rounded-full ${isRequested ? 'bg-orange-500 text-white' : isWeekend ? 'text-red-500' : 'text-slate-700'}`}>
                     {day}
                   </span>
                   {isRequested && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">休み希望</span>}
                 </div>
                 
                 {event && (
                   <div className="mt-2 text-xs bg-blue-50 text-blue-700 border border-blue-100 p-1 rounded">
                     {event.title}
                   </div>
                 )}
               </div>
             );
           })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-teal-600" />
          特記事項
        </h3>
        <textarea
          className="w-full h-32 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
          placeholder="その他、シフトに関する要望があれば記入してください（例：15日は午前中のみ可など）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default ShiftRequestScreen;

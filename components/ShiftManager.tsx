import React, { useState, useRef, useEffect } from 'react';
import { ShiftRequest, FacilityEvent, ShiftResult, Staff } from '../types';
import { SHIFT_TYPES, CURRENT_YEAR, CURRENT_MONTH } from '../constants';
import { Play, Download, RefreshCw, X } from 'lucide-react';

interface ShiftManagerProps {
  requests: ShiftRequest[];
  events: FacilityEvent[];
  staffList: Staff[];
}

const ShiftManager: React.FC<ShiftManagerProps> = ({ requests, events, staffList }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [shiftData, setShiftData] = useState<ShiftResult[]>([]);
  const [activeCell, setActiveCell] = useState<{staffId: string, day: number} | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const daysInMonth = new Date(CURRENT_YEAR, CURRENT_MONTH, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    // Close popover if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveCell(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      const newShifts: ShiftResult[] = [];
      
      staffList.forEach(staff => {
        days.forEach(day => {
          const dateStr = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const req = requests.find(r => r.staffId === staff.id && r.date === dateStr);
          
          let shiftId = 'S2'; // Default Day
          
          if (req) {
            shiftId = 'S5'; // Grant Request
          } else {
            // Randomly assign shifts for demo
            const rand = Math.random();
            if (rand < 0.2) shiftId = 'S1'; // Early
            else if (rand < 0.6) shiftId = 'S2'; // Day
            else if (rand < 0.8) shiftId = 'S3'; // Late
            else if (rand < 0.9) shiftId = 'S4'; // Night
            else shiftId = 'S5'; // Off
          }
          
          newShifts.push({
            id: `${staff.id}-${day}`,
            date: dateStr,
            staffId: staff.id,
            shiftId: shiftId
          });
        });
      });

      setShiftData(newShifts);
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const getShift = (staffId: string, day: number) => {
    const dateStr = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return shiftData.find(s => s.staffId === staffId && s.date === dateStr);
  };

  const getShiftMeta = (shiftId: string) => SHIFT_TYPES.find(s => s.id === shiftId);

  const updateShift = (staffId: string, day: number, newShiftId: string) => {
    const dateStr = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setShiftData(prev => {
      const existing = prev.find(s => s.staffId === staffId && s.date === dateStr);
      if (existing) {
        return prev.map(s => s.id === existing.id ? { ...s, shiftId: newShiftId } : s);
      }
      return [...prev, { id: `${staffId}-${day}`, staffId, date: dateStr, shiftId: newShiftId }];
    });
    setActiveCell(null);
  };

  const calculateStats = (day: number) => {
    const dateStr = `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayShifts = shiftData.filter(s => s.date === dateStr);
    
    return {
      early: dayShifts.filter(s => s.shiftId === 'S1').length,
      day: dayShifts.filter(s => s.shiftId === 'S2').length,
      late: dayShifts.filter(s => s.shiftId === 'S3').length,
      night: dayShifts.filter(s => s.shiftId === 'S4').length,
    };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {CURRENT_YEAR}年 {CURRENT_MONTH}月 シフト作成・調整
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            「自動作成」ボタンを押すとAIが最適なシフトを提案します。セルをクリックして手動修正も可能です。
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex items-center px-4 py-2 rounded-lg font-bold text-white shadow transition-all ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {isGenerating ? '計算中...' : '自動作成 (AI)'}
          </button>
          
          {generated && (
            <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow transition-all">
              <Download className="w-5 h-5 mr-2" />
              PDF出力
            </button>
          )}
        </div>
      </div>

      {!generated && !isGenerating && (
        <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 min-h-[400px]">
          <div className="text-center text-slate-400">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">「自動作成」ボタンを押してシフトを生成してください</p>
          </div>
        </div>
      )}

      {isGenerating && (
         <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 min-h-[400px]">
           <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
           <h3 className="text-lg font-bold text-slate-700">最適化計算を実行中...</h3>
           <p className="text-slate-500 text-sm mt-2">制約条件: 連勤制限, 夜勤間隔, 必要人数...</p>
         </div>
      )}

      {generated && (
        <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="overflow-auto flex-1 relative">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-2 border bg-slate-50 sticky left-0 z-20 min-w-[140px] text-left text-slate-600">
                    職員名 / 日付
                  </th>
                  {days.map(day => {
                    const date = new Date(CURRENT_YEAR, CURRENT_MONTH - 1, day);
                    const dayOfWeek = date.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const colorClass = dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-slate-700';
                    return (
                      <th key={day} className={`p-1 border min-w-[40px] text-center ${isWeekend ? 'bg-slate-50' : ''}`}>
                        <div className={colorClass}>{day}</div>
                        <div className={`text-xs font-normal ${colorClass}`}>
                          {['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {staffList.map(staff => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td className="p-2 border sticky left-0 z-10 bg-white font-medium text-slate-700 border-r-2 border-r-slate-200">
                      <div className="flex flex-col">
                        <span>{staff.name}</span>
                        <span className="text-xs text-slate-400 font-normal">{staff.role}</span>
                      </div>
                    </td>
                    {days.map(day => {
                      const shift = getShift(staff.id, day);
                      const meta = shift ? getShiftMeta(shift.shiftId) : null;
                      const isActive = activeCell?.staffId === staff.id && activeCell?.day === day;
                      
                      return (
                        <td 
                          key={day} 
                          className="border text-center p-0 relative"
                        >
                          <button
                            onClick={() => setActiveCell({ staffId: staff.id, day })}
                            className={`
                              w-full h-12 flex items-center justify-center text-xs font-bold transition-colors
                              ${meta?.color || 'bg-white'} ${meta?.textColor || 'text-slate-400'}
                              ${isActive ? 'ring-2 ring-teal-500 z-20' : 'hover:opacity-80'}
                            `}
                          >
                            {meta?.name.substring(0, 1) || '-'}
                          </button>
                          
                          {/* Popover for selecting shift */}
                          {isActive && (
                            <div 
                              ref={popoverRef}
                              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-2 grid grid-cols-2 gap-2 min-w-[120px]"
                              style={{ left: day > daysInMonth - 3 ? 'auto' : 0, right: day > daysInMonth - 3 ? 0 : 'auto' }}
                            >
                              <div className="col-span-2 flex justify-between items-center text-xs text-slate-500 mb-1 px-1">
                                <span>シフト変更</span>
                                <button onClick={(e) => { e.stopPropagation(); setActiveCell(null); }}><X className="w-3 h-3" /></button>
                              </div>
                              {SHIFT_TYPES.map(s => (
                                <button
                                  key={s.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateShift(staff.id, day, s.id);
                                  }}
                                  className={`px-2 py-1.5 rounded text-xs font-bold ${s.color} ${s.textColor} hover:brightness-95`}
                                >
                                  {s.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Summary Rows */}
                {['早出', '日勤', '遅出', '夜勤'].map((typeLabel) => {
                  const typeId = SHIFT_TYPES.find(s => s.name === typeLabel)?.id || '';
                  const typeColor = SHIFT_TYPES.find(s => s.name === typeLabel)?.color.replace('bg-', 'bg-').replace('100', '50') || 'bg-slate-50';
                  
                  return (
                    <tr key={typeLabel} className="bg-slate-50">
                      <td className="p-2 border sticky left-0 z-10 bg-slate-50 text-xs font-bold text-slate-600 text-right pr-4">
                        {typeLabel} 計
                      </td>
                      {days.map(day => {
                        const stats = calculateStats(day);
                        const count = 
                           typeLabel === '早出' ? stats.early :
                           typeLabel === '日勤' ? stats.day :
                           typeLabel === '遅出' ? stats.late :
                           typeLabel === '夜勤' ? stats.night : 0;
                        
                        // Validation logic (simple example)
                        let isInvalid = false;
                        if (typeLabel === '早出' && count < 2) isInvalid = true;
                        if (typeLabel === '夜勤' && count < 1) isInvalid = true;

                        return (
                          <td key={day} className={`border text-center text-xs p-1 ${isInvalid ? 'bg-red-50' : typeColor}`}>
                            <span className={isInvalid ? 'text-red-600 font-bold' : 'text-slate-600'}>
                              {count}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManager;
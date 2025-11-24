import React, { useState } from 'react';
import { FacilityEvent } from '../types';
import { Calendar, Plus, Trash2, X, MapPin } from 'lucide-react';

interface EventManagerProps {
  events: FacilityEvent[];
  onUpdateEvents: (events: FacilityEvent[]) => void;
}

const EventManager: React.FC<EventManagerProps> = ({ events, onUpdateEvents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<FacilityEvent>>({
    date: '',
    title: '',
    description: '',
    group: ['1']
  });

  const handleDelete = (id: string) => {
    if (confirm('このイベントを削除してもよろしいですか？')) {
      onUpdateEvents(events.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.date || !newEvent.title) return;

    const event: FacilityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: newEvent.date,
      title: newEvent.title,
      description: newEvent.description || '',
      group: newEvent.group || ['1']
    };

    onUpdateEvents([...events, event].sort((a, b) => a.date.localeCompare(b.date)));
    setIsModalOpen(false);
    setNewEvent({ date: '', title: '', description: '', group: ['1'] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-teal-600" />
            イベント管理
          </h2>
          <p className="text-slate-500 mt-1">施設内の行事や予定を管理します。</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-1" />
          新規イベント登録
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <div key={event.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
            <button
              onClick={() => handleDelete(event.id)}
              className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex items-start justify-between mb-3">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                {event.date}
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h3>
            <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{event.description || '詳細なし'}</p>
            <div className="flex items-center text-xs text-slate-400">
              <MapPin className="w-3 h-3 mr-1" />
              対象グループ: {event.group.join(', ')}
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>登録されたイベントはありません</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-700">新規イベント登録</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">日付 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">イベント名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="例：避難訓練"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">詳細内容</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none"
                  placeholder="イベントの詳細を入力..."
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  登録する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
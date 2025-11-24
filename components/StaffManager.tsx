import React, { useState } from 'react';
import { Staff } from '../types';
import { Users, Plus, Pencil, Trash2, X, ShieldCheck, Stethoscope } from 'lucide-react';

interface StaffManagerProps {
  staffList: Staff[];
  onUpdateStaff: (staff: Staff[]) => void;
}

const StaffManager: React.FC<StaffManagerProps> = ({ staffList, onUpdateStaff }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState: Staff = {
    id: '',
    name: '',
    role: '職員',
    unit: 'さくら',
    group: ['1'],
    employmentType: '常勤',
    isQualified: false,
    isAdmin: false,
    password: 'user'
  };

  const [formData, setFormData] = useState<Staff>(initialFormState);

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingId(staff.id);
      setFormData({ ...staff });
    } else {
      setEditingId(null);
      setFormData({ ...initialFormState, id: Math.random().toString(36).substr(2, 9) });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('この職員を削除してもよろしいですか？')) {
      onUpdateStaff(staffList.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      onUpdateStaff(staffList.map(s => s.id === editingId ? formData : s));
    } else {
      onUpdateStaff([...staffList, formData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-teal-600" />
            職員管理
          </h2>
          <p className="text-slate-500 mt-1">職員情報の登録・編集・権限設定を行います。</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-1" />
          職員を追加
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b">
              <tr>
                <th className="px-6 py-4">氏名 / ID</th>
                <th className="px-6 py-4">所属・役職</th>
                <th className="px-6 py-4">雇用形態</th>
                <th className="px-6 py-4">資格・権限</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map(staff => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{staff.name}</div>
                    <div className="text-xs text-slate-400">ID: {staff.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{staff.unit}</div>
                    <div className="text-xs text-slate-500">{staff.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${staff.employmentType === '常勤' ? 'bg-green-100 text-green-800' : 
                        staff.employmentType === 'パート' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                      {staff.employmentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {staff.isQualified && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-50 text-purple-700 border border-purple-100" title="喀痰吸引資格者">
                          <Stethoscope className="w-3 h-3 mr-1" />
                          有資格
                        </span>
                      )}
                      {staff.isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200" title="管理者">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          管理者
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(staff)}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(staff.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 sticky top-0">
              <h3 className="font-bold text-slate-700">{editingId ? '職員情報の編集' : '新規職員登録'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">氏名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">パスワード</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.password || ''}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ユニット</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">役職</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">雇用形態</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    value={formData.employmentType}
                    onChange={e => setFormData({ ...formData, employmentType: e.target.value as any })}
                  >
                    <option value="常勤">常勤</option>
                    <option value="パート">パート</option>
                    <option value="派遣">派遣</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">グループ</label>
                  <input
                     type="text"
                     placeholder="例: 1, 2"
                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                     value={formData.group.join(',')}
                     onChange={e => setFormData({ ...formData, group: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                    checked={formData.isQualified}
                    onChange={e => setFormData({ ...formData, isQualified: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-slate-700">喀痰吸引資格を持っている</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                    checked={formData.isAdmin}
                    onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-slate-700">管理者権限を付与する（シフト作成・設定が可能）</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t">
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
                  {editingId ? '更新する' : '登録する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
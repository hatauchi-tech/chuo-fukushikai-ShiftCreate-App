import React, { useState } from 'react';
import { Staff } from '../types';
import { ClipboardList, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: Staff) => void;
  staffList: Staff[];
}

const Login: React.FC<LoginProps> = ({ onLogin, staffList }) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = staffList.find(s => s.id === selectedStaffId);
    
    if (!user) {
      setError('職員を選択してください。');
      return;
    }

    // Simple mock password check
    if (user.password && user.password !== password) {
      setError('パスワードが間違っています。');
      return;
    }

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-teal-700 p-8 text-center">
          <div className="mx-auto bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
             <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ShiftCare AI</h1>
          <p className="text-teal-100 text-sm mt-1">介護シフト自動作成システム</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                職員名
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                required
              >
                <option value="">選択してください</option>
                {staffList.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
              />
              <p className="text-xs text-slate-400 mt-2">
                ※デモ用: 管理者=admin, 一般=user
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors duration-200"
            >
              ログイン
            </button>
          </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t">
          <p className="text-xs text-slate-500">
            Powered by Google Cloud Run & OR-Tools (Mock)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React from 'react';
import { ViewState, Staff } from '../types';
import { Calendar, Users, ClipboardList, Settings, LogOut, Menu, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: Staff | null;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, currentView, setView, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, label, icon: Icon, adminOnly = false }: { view: ViewState; label: string; icon: any; adminOnly?: boolean }) => {
    if (adminOnly && !currentUser?.isAdmin) return null;
    
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setView(view);
          setIsMobileMenuOpen(false);
        }}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
          isActive
            ? 'bg-teal-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-100 hover:text-teal-700'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold text-teal-700 flex items-center gap-2">
          <ClipboardList className="w-6 h-6" />
          ShiftCare AI
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:block">
            <h1 className="text-2xl font-extrabold text-teal-700 flex items-center gap-2">
              <ClipboardList className="w-8 h-8" />
              ShiftCare AI
            </h1>
            <p className="text-xs text-slate-400 mt-1 pl-10">Smart Shift Management</p>
          </div>

          <div className="p-4 border-b md:border-none bg-slate-50 md:bg-transparent">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="bg-teal-100 p-2 rounded-full">
                <UserCircle className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">{currentUser?.role} | {currentUser?.unit}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <NavItem view="REQUEST" label="シフト希望提出" icon={Calendar} />
            
            {currentUser?.isAdmin && (
              <>
                <div className="my-4 border-t border-slate-200"></div>
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">管理者メニュー</p>
                <NavItem view="MANAGER" label="シフト作成・管理" icon={ClipboardList} adminOnly />
                <NavItem view="EVENTS" label="イベント管理" icon={Calendar} adminOnly />
                <NavItem view="STAFF" label="職員管理" icon={Users} adminOnly />
              </>
            )}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              ログアウト
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;

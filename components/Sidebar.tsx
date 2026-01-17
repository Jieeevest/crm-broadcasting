import React from 'react';
import { LayoutDashboard, PenTool, Users, Share2, LogOut, Settings } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void; // Simulated role switch
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'create', label: 'Content CMS', icon: PenTool, roles: [UserRole.ADMIN] },
    { id: 'feed', label: 'Share Feed', icon: Share2, roles: [UserRole.EMPLOYEE, UserRole.ADMIN] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'integrations', label: 'Integrations', icon: Settings, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20 shadow-sm">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
        <div className="w-8 h-8 bg-aqua-500 rounded-lg flex items-center justify-center text-white font-bold">
          S
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Social<span className="text-aqua-500">Sync</span></h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.filter(item => item.roles.includes(currentRole)).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                isActive 
                  ? 'bg-aqua-50 text-aqua-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-aqua-600' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Switch User</span>
        </button>
      </div>
    </div>
  );
};
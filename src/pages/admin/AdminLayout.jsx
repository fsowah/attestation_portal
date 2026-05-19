import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  Users,
  LogOut,
  Bell,
  Search,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LogoCrest from '../../assets/images/Logo_crest.png';

const AdminLayout = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard',     path: '/admin',              icon: LayoutDashboard },
    { name: 'Applications',  path: '/admin/applications', icon: FileText },
    { name: 'Appointments',  path: '/admin/appointments', icon: Calendar },
    { name: 'Users',         path: '/admin/users',        icon: Users },
    { name: 'Settings',      path: '/admin/settings',     icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-inter overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a1628] flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo + close button */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LogoCrest} alt="MoFA Logo" className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs uppercase tracking-wider">MoFA Portal</span>
              <span className="text-brand-gold-500 text-[10px] font-medium uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow px-4 mt-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-brand-gold-500 text-brand-navy-900 font-bold shadow-lg shadow-brand-gold-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-navy-900' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-white/60 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 lg:h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-4 lg:px-6 shrink-0 gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-neutral-400 hover:text-brand-navy-800 transition-colors rounded-lg hover:bg-neutral-50"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-3 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100 flex-grow max-w-xs lg:max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search applications..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-400"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 text-neutral-400 hover:text-brand-navy-800 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-100">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-brand-navy-800 leading-tight">Administrator</span>
                <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[120px]">{user?.email || 'Admin'}</span>
              </div>
              <div className="w-8 h-8 bg-brand-gold-100 rounded-full flex items-center justify-center text-brand-gold-600 font-bold border border-brand-gold-200 shadow-sm shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 lg:p-6 xl:p-8 bg-[#f8f9fa]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

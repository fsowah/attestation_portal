import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LogoCrest from '../../assets/images/Logo_crest.png';

const AdminLayout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-inter overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1628] flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <img src={LogoCrest} alt="MoFA Logo" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs uppercase tracking-wider">MoFA Portal</span>
            <span className="text-brand-gold-500 text-[10px] font-medium uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-grow px-4 mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-brand-gold-500 text-brand-navy-900 font-bold shadow-lg shadow-brand-gold-500/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-navy-900' : ''}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-100 w-96 max-w-full">
            <Search className="w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search applications, names..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-neutral-400 hover:text-brand-navy-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-brand-navy-800">Administrator</span>
                <span className="text-[11px] text-neutral-400 font-medium">{profile?.email || 'Admin'}</span>
              </div>
              <div className="w-10 h-10 bg-brand-gold-100 rounded-full flex items-center justify-center text-brand-gold-600 font-bold border border-brand-gold-200 shadow-sm">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#f8f9fa]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

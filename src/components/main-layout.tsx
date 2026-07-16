import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, QrCode, Users, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import logoImg from '../assets/AEISC_logo.png';

export const MainLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/', label: 'Escáner', icon: QrCode },
    { path: '/participants', label: 'Participantes', icon: Users },
    { path: '/create', label: 'Crear', icon: PlusCircle },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-gray-800 antialiased">
      {/* Header (Top Navigation) */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-150 bg-white px-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="AEISC Logo" 
            className="h-9 w-9 object-contain"
          />
          <span className="font-bold text-[#0071ba] text-base tracking-tight">
            Bingo AEISC 2026
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        <div className="mx-auto max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-150 bg-white shadow-[0_-4px_16px_rgb(0,0,0,0.03)]">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1.5 w-20 py-2 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'text-[#0071ba] font-medium' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div 
                  className={`flex h-10 w-16 items-center justify-center rounded-2xl transition-all duration-200 ${
                    isActive ? 'bg-[#00a0fe]/15 text-[#0071ba]' : 'bg-transparent'
                  }`}
                >
                  <Icon size={22} className={isActive ? 'scale-105' : ''} />
                </div>
                <span className="text-[11px] tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

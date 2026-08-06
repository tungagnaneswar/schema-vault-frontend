import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { authApi } from '../api/authApi';
import { type RootState } from '../store/store';
import { LayoutDashboard, LogOut, ShieldCheck, Sun, Moon, ChevronDown, Users, Folder, PanelLeftClose, PanelLeftOpen, User } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';
import { GLOBAL_ROLES } from '../constants/roles';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    authApi.logout().catch(() => {}).finally(() => {
      dispatch(logout());
      navigate('/login');
    });
  };

  const baseNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Folder },
  ];

  const adminNavItems = user?.role === GLOBAL_ROLES.SUPER_ADMIN || user?.role === GLOBAL_ROLES.ADMIN
    ? [{ name: 'Team Management', path: '/team-management', icon: Users }]
    : [];

  const superAdminNavItems = user?.role === GLOBAL_ROLES.SUPER_ADMIN
    ? [{ name: 'Super Admin', path: '/super-admin-dashboard', icon: ShieldCheck }]
    : [];

  const navItems = [...baseNavItems, ...adminNavItems, ...superAdminNavItems];

  return (
    <div className="h-screen flex overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <aside
        className={clsx(
          'bg-background border-r flex flex-col shadow-sm hidden md:flex shrink-0 transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo / Brand */}
        <div className={clsx(
          'h-16 flex items-center border-b shrink-0 overflow-hidden',
          isSidebarCollapsed ? 'justify-center px-0' : 'px-5 gap-2'
        )}>
          <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
          <h1
            className={clsx(
              'text-lg font-bold tracking-tight text-foreground whitespace-nowrap transition-all duration-300 ease-in-out',
              isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            )}
          >
            SchemaDiff
          </h1>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isSidebarCollapsed ? item.name : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors overflow-hidden',
                  isSidebarCollapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span
                  className={clsx(
                    'whitespace-nowrap transition-all duration-300 ease-in-out',
                    isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle at the bottom */}
        <div className="border-t p-2">
          <button
            onClick={() => {
              const next = !isSidebarCollapsed;
              setIsSidebarCollapsed(next);
              localStorage.setItem('sidebarCollapsed', String(next));
            }}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
              isSidebarCollapsed ? 'justify-center' : ''
            )}
          >
            {isSidebarCollapsed
              ? <PanelLeftOpen className="w-4 h-4 shrink-0" />
              : <PanelLeftClose className="w-4 h-4 shrink-0" />
            }
            <span
              className={clsx(
                'whitespace-nowrap transition-all duration-300 ease-in-out',
                isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              )}
            >
              Collapse
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-background border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center md:hidden">
            <ShieldCheck className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">SchemaDiff</h1>
          </div>
          
          <div className="hidden md:flex flex-1 pr-6 items-center" id="header-portal-target">
            {/* Page header content injected via Portal */}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-muted/50 p-1.5 pr-3 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none mb-1">{user?.email}</p>
                  <p className="text-xs text-muted-foreground leading-none">{user?.role}</p>
                </div>
                <ChevronDown className={clsx("w-4 h-4 text-muted-foreground transition-transform", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-md border py-1 z-20">
                  <div className="px-4 py-2 border-b sm:hidden">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

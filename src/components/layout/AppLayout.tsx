import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Truck, Wrench, Warehouse,
  Users, MapPin, Shield, DollarSign, BarChart3, MessageCircle,
  BookOpen, ChevronDown, Menu, X, Search, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import NotificationBell from '@/components/notifications/NotificationBell';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: 'لوحة التحكم', path: '/', icon: LayoutDashboard },
  { 
    label: 'إدارة المشتريات', path: '/procurement', icon: ShoppingCart,
    children: [
      { label: 'طلبات الاحتياج', path: '/procurement/requisitions' },
      { label: 'عروض الأسعار', path: '/procurement/rfq' },
      { label: 'أوامر الشراء', path: '/procurement/orders' },
      { label: 'الموردين', path: '/procurement/vendors' },
      { label: 'الفواتير', path: '/procurement/invoices' },
    ]
  },
  { 
    label: 'إدارة الأسطول', path: '/fleet', icon: Truck,
    children: [
      { label: 'الشاحنات', path: '/fleet/trucks' },
      { label: 'الكفرات', path: '/fleet/tires' },
    ]
  },
  { 
    label: 'الصيانة والورشة', path: '/maintenance', icon: Wrench,
    children: [
      { label: 'أوامر العمل', path: '/maintenance/work-orders' },
      { label: 'الصيانة الدورية', path: '/maintenance/scheduled' },
    ]
  },
  { 
    label: 'المستودعات', path: '/warehouse', icon: Warehouse,
    children: [
      { label: 'المخزون', path: '/warehouse/inventory' },
      { label: 'حركة المخزون', path: '/warehouse/movements' },
    ]
  },
  { label: 'السائقين', path: '/drivers', icon: Users },
  { label: 'التتبع والمراقبة', path: '/tracking', icon: MapPin },
  { label: 'الجودة', path: '/quality', icon: Shield },
  { 
    label: 'الإدارة المالية', path: '/finance', icon: DollarSign,
    children: [
      { label: 'المدفوعات', path: '/finance/payments' },
      { label: 'الأرصدة', path: '/finance/balances' },
    ]
  },
  { label: 'التقارير', path: '/reports', icon: BarChart3 },
  { label: 'المحادثات', path: '/chat', icon: MessageCircle },
  { label: 'دليل الاستخدام', path: '/guide', icon: BookOpen },
];

const settingsItems = [
  { label: 'إدارة المستخدمين', path: '/settings/users' },
  { label: 'إعدادات ERPNext', path: '/settings/erpnext' },
];

const AppSidebar: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const { role } = useAuth();

  const toggleExpand = (path: string) => {
    setExpandedItems(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={onToggle} />}
      <aside className={`fixed top-0 right-0 h-full bg-sidebar z-50 transition-all duration-300 flex flex-col
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 translate-x-full lg:translate-x-0 lg:w-64'}`}>
        
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Truck className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground font-heading">نظام اللوجستيات</h1>
            <p className="text-[11px] text-sidebar-muted">إدارة الأسطول والمشتريات</p>
          </div>
          <button onClick={onToggle} className="mr-auto lg:hidden text-sidebar-muted hover:text-sidebar-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <>
                  <button onClick={() => toggleExpand(item.path)}
                    className={`sidebar-link w-full ${isActive(item.path) ? 'sidebar-link-active' : ''}`}>
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1 text-right text-sm">{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedItems.includes(item.path) ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedItems.includes(item.path) && (
                    <div className="mr-7 mt-0.5 space-y-0.5">
                      {item.children.map(child => (
                        <Link key={child.path} to={child.path}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors
                            ${location.pathname === child.path ? 'text-sidebar-primary bg-sidebar-accent font-medium' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'}`}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link to={item.path}
                  className={`sidebar-link ${isActive(item.path) && item.path === '/' ? location.pathname === '/' ? 'sidebar-link-active' : '' : isActive(item.path) ? 'sidebar-link-active' : ''}`}>
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}

          {/* Settings (admin only) */}
          {role === 'admin' && (
            <div>
              <button onClick={() => setShowSettings(!showSettings)}
                className={`sidebar-link w-full ${isActive('/settings') ? 'sidebar-link-active' : ''}`}>
                <Settings className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1 text-right text-sm">الإعدادات</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
              </button>
              {showSettings && (
                <div className="mr-7 mt-0.5 space-y-0.5">
                  {settingsItems.map(s => (
                    <Link key={s.path} to={s.path}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors
                        ${location.pathname === s.path ? 'text-sidebar-primary bg-sidebar-accent font-medium' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'}`}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <UserFooter />
        </div>
      </aside>
    </>
  );
};

const UserFooter = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
        <span className="text-xs font-semibold text-sidebar-foreground">{user?.email?.charAt(0)?.toUpperCase() || 'م'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email || 'مستخدم'}</p>
      </div>
      <button onClick={signOut} className="text-sidebar-muted hover:text-sidebar-foreground" title="تسجيل خروج">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};

interface LayoutProps { children: React.ReactNode; }

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:mr-64">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b px-4 lg:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="بحث في النظام..."
                className="w-full bg-muted/50 border-0 rounded-lg pr-10 pl-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <NotificationBell />
          </div>
        </header>
        <main className="p-4 lg:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;

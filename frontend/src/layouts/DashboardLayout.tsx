import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegeService } from '../services/collegeService';
import type { College } from '../types';
import { ROLE_LABELS, type UserRole } from '../constants/roles';

import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserSquare2,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  FileCheck2,
  Clock,
  Banknote,
  Library,
  Building,
  Bus,
  CalendarOff,
  Briefcase,
  CalendarDays,
  Bell,
  FileText,
  LifeBuoy,
  BarChart3,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

export const DashboardLayout: React.FC = () => {
  const { user, role, activeCollegeId, switchCollege, logout, isDarkMode, toggleDarkMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<College[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    collegeService.getAllColleges()
      .then((data) => setColleges(data || []))
      .catch(() => setColleges([]));
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const activeCollege = colleges.find((c) => c.id === activeCollegeId);

  // Navigation Items defined with strict role permissions
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: 'Colleges & Hierarchy',
      path: '/colleges',
      icon: <Building2 className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    },
    {
      name: 'Students',
      path: '/students',
      icon: <Users className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY'],
    },
    {
      name: 'Faculty',
      path: '/faculty',
      icon: <UserSquare2 className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD'],
    },
    {
      name: 'Courses',
      path: '/courses',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Enrollment',
      path: '/enrollment',
      icon: <ClipboardList className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: <CalendarCheck className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT', 'PARENT'],
    },
    {
      name: 'Examinations',
      path: '/exams',
      icon: <FileCheck2 className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'EXAM_OFFICER', 'HOD', 'FACULTY', 'STUDENT', 'PARENT'],
    },
    {
      name: 'Timetable',
      path: '/timetable',
      icon: <Clock className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Fees & Invoicing',
      path: '/fees',
      icon: <Banknote className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'ACCOUNTANT', 'STUDENT', 'PARENT'],
    },
    {
      name: 'Library',
      path: '/library',
      icon: <Library className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'LIBRARIAN', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Hostel',
      path: '/hostel',
      icon: <Building className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOSTEL_WARDEN', 'STUDENT'],
    },
    {
      name: 'Transport',
      path: '/transport',
      icon: <Bus className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'STUDENT'],
    },
    {
      name: 'Leave Management',
      path: '/leave',
      icon: <CalendarOff className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Placements',
      path: '/placement',
      icon: <Briefcase className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'STUDENT'],
    },
    {
      name: 'Events & Calendar',
      path: '/events',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      name: 'Document Vault',
      path: '/documents',
      icon: <FileText className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'],
    },
    {
      name: 'Helpdesk Tickets',
      path: '/helpdesk',
      icon: <LifeBuoy className="w-4 h-4" />,
    },
    {
      name: 'Reports & Analytics',
      path: '/reports',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'EXAM_OFFICER', 'ACCOUNTANT'],
    },
  ];

  // Filter items visible for the user's role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return role ? item.roles.includes(role) : false;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0 shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <BrandLogo size="md" />
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'Admin'} size="sm" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{role ? ROLE_LABELS[role] : ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white flex flex-col h-full border-r border-slate-200 z-10">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <BrandLogo size="sm" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700 p-1.5 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Super Admin Tenant Switcher */}
            {role === 'SUPER_ADMIN' && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Tenant:</span>
                <select
                  value={activeCollegeId}
                  onChange={(e) => switchCollege(parseInt(e.target.value, 10))}
                  className="text-xs border border-slate-200 rounded-lg bg-white text-slate-800 py-1.5 px-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {role !== 'SUPER_ADMIN' && activeCollege && (
              <span className="hidden sm:inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {activeCollege.name}
              </span>
            )}
          </div>

          {/* Right Action Icons & Persona Switcher */}
          <div className="flex items-center gap-3">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </Link>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Avatar name={user?.name || 'Admin'} size="sm" />
                <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                  {user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <Badge variant="primary" size="sm" className="mt-1.5">
                      {role ? ROLE_LABELS[role] : ''}
                    </Badge>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

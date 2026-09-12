import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { CollegeAdminDashboard } from './CollegeAdminDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { StudentDashboard } from './StudentDashboard';
import { ParentDashboard } from './ParentDashboard';

export const DashboardIndex: React.FC = () => {
  const { role } = useAuth();

  switch (role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'FACULTY':
    case 'HOD':
      return <FacultyDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'PARENT':
      return <ParentDashboard />;
    case 'COLLEGE_ADMIN':
    case 'EXAM_OFFICER':
    case 'ACCOUNTANT':
    case 'LIBRARIAN':
    case 'HOSTEL_WARDEN':
    case 'PLACEMENT_OFFICER':
    case 'TRANSPORT_MANAGER':
    default:
      return <CollegeAdminDashboard />;
  }
};

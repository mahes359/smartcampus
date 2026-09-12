import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Pages
import { LandingPage } from '../pages/public/LandingPage';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { DashboardIndex } from '../pages/dashboards/DashboardIndex';
import { CollegeListPage } from '../pages/colleges/CollegeListPage';
import { StudentListPage } from '../pages/students/StudentListPage';
import { StudentDetailPage } from '../pages/students/StudentDetailPage';
import { FacultyListPage } from '../pages/faculty/FacultyListPage';
import { CourseListPage } from '../pages/courses/CourseListPage';
import { EnrollmentListPage } from '../pages/enrollment/EnrollmentListPage';
import { AttendanceListPage } from '../pages/attendance/AttendanceListPage';
import { ExamListPage } from '../pages/exams/ExamListPage';
import { TimetablePage } from '../pages/timetable/TimetablePage';
import { FeeManagementPage } from '../pages/fees/FeeManagementPage';
import { LibraryPage } from '../pages/library/LibraryPage';
import { HostelPage } from '../pages/hostel/HostelPage';
import { TransportPage } from '../pages/transport/TransportPage';
import { LeavePage } from '../pages/leave/LeavePage';
import { PlacementPage } from '../pages/placement/PlacementPage';
import { EventPage } from '../pages/events/EventPage';
import { NotificationCenterPage } from '../pages/notifications/NotificationCenterPage';
import { DocumentVaultPage } from '../pages/documents/DocumentVaultPage';
import { HelpdeskPage } from '../pages/helpdesk/HelpdeskPage';
import { ReportsAnalyticsPage } from '../pages/reports/ReportsAnalyticsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { NotFoundPage } from '../pages/common/NotFoundPage';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Institutional Portal & Authentication Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage initialOpenLogin={true} />} />
      <Route element={<AuthLayout />}>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected ERP Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardIndex />} />

          {/* College Hierarchy (Super Admin & College Admin) */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN']} />}>
            <Route path="/colleges" element={<CollegeListPage />} />
          </Route>

          {/* Student Roster & Academic Details */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY']} />}>
            <Route path="/students" element={<StudentListPage />} />
          </Route>
          <Route path="/students/:id" element={<StudentDetailPage />} />

          {/* Faculty Management */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD']} />}>
            <Route path="/faculty" element={<FacultyListPage />} />
          </Route>

          {/* Courses, Enrollment, Attendance, Exams */}
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/enrollment" element={<EnrollmentListPage />} />
          <Route path="/attendance" element={<AttendanceListPage />} />
          <Route path="/exams" element={<ExamListPage />} />

          {/* Campus Operations */}
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/fees" element={<FeeManagementPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/placement" element={<PlacementPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/notifications" element={<NotificationCenterPage />} />
          <Route path="/documents" element={<DocumentVaultPage />} />
          <Route path="/helpdesk" element={<HelpdeskPage />} />

          {/* Reports & Analytics */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'EXAM_OFFICER', 'ACCOUNTANT']} />}>
            <Route path="/reports" element={<ReportsAnalyticsPage />} />
          </Route>

          {/* User Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Access Control & Fallbacks */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

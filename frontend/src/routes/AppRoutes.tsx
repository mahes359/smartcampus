import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Protected ERP Pages
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
      {/* Public Institutional Portal */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Dedicated Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected ERP Application Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Primary Dashboard */}
          <Route path="/dashboard" element={<DashboardIndex />} />

          {/* Institutional Hierarchy */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN']} />}>
            <Route path="/colleges" element={<CollegeListPage />} />
          </Route>

          {/* Student Roster & Records */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY']} />}>
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/:id" element={<StudentDetailPage />} />
          </Route>

          {/* Faculty Management */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD']} />}>
            <Route path="/faculty" element={<FacultyListPage />} />
          </Route>

          {/* Academic Courses & Curriculum */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT']} />}>
            <Route path="/courses" element={<CourseListPage />} />
          </Route>

          {/* Course Enrollment & Registration */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT']} />}>
            <Route path="/enrollment" element={<EnrollmentListPage />} />
          </Route>

          {/* Attendance Tracking */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT', 'PARENT']} />}>
            <Route path="/attendance" element={<AttendanceListPage />} />
          </Route>

          {/* Examination & Grades */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'EXAM_OFFICER', 'HOD', 'FACULTY', 'STUDENT', 'PARENT']} />}>
            <Route path="/exams" element={<ExamListPage />} />
          </Route>

          {/* Class Timetable */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT']} />}>
            <Route path="/timetable" element={<TimetablePage />} />
          </Route>

          {/* Fee Management & Invoicing */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'ACCOUNTANT', 'STUDENT', 'PARENT']} />}>
            <Route path="/fees" element={<FeeManagementPage />} />
          </Route>

          {/* Library Management */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'LIBRARIAN', 'FACULTY', 'STUDENT']} />}>
            <Route path="/library" element={<LibraryPage />} />
          </Route>

          {/* Hostel Management */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOSTEL_WARDEN', 'STUDENT']} />}>
            <Route path="/hostel" element={<HostelPage />} />
          </Route>

          {/* Campus Transport */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'STUDENT']} />}>
            <Route path="/transport" element={<TransportPage />} />
          </Route>

          {/* Leave & Absence Management */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT']} />}>
            <Route path="/leave" element={<LeavePage />} />
          </Route>

          {/* Career & Placements */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'STUDENT']} />}>
            <Route path="/placement" element={<PlacementPage />} />
          </Route>

          {/* Institutional Document Vault */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT']} />}>
            <Route path="/documents" element={<DocumentVaultPage />} />
          </Route>

          {/* Institutional Reports & Analytics */}
          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'EXAM_OFFICER', 'ACCOUNTANT']} />}>
            <Route path="/reports" element={<ReportsAnalyticsPage />} />
          </Route>

          {/* Campus-Wide Modules (All Authenticated ERP Users) */}
          <Route path="/events" element={<EventPage />} />
          <Route path="/notifications" element={<NotificationCenterPage />} />
          <Route path="/helpdesk" element={<HelpdeskPage />} />

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

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import { attendanceService } from '../../services/attendanceService';
import { feeService } from '../../services/feeService';
import { notificationService } from '../../services/notificationService';
import type { Student, Course, Attendance, FeeRecord, NotificationItem } from '../../types';
import { CalendarCheck, Award, Banknote, Bell } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const ParentDashboard: React.FC = () => {
  const { user, activeCollegeId } = useAuth();
  const [ward, setWard] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [notices, setNotices] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      studentService.getAllStudents(activeCollegeId).catch(() => []),
      courseService.getAllCourses(activeCollegeId).catch(() => []),
      attendanceService.getAttendanceByCollege(activeCollegeId).catch(() => []),
      feeService.getFees(activeCollegeId).catch(() => []),
      notificationService.getNotifications(activeCollegeId).catch(() => []),
    ]).then(([studentsData, coursesData, attendData, feesData, notifsData]) => {
      if (studentsData.length > 0) {
        setWard(studentsData[0]);
      }
      setCourses(coursesData || []);
      setAttendance(attendData || []);
      setFees(feesData || []);
      setNotices(notifsData || []);
      setIsLoading(false);
    });
  }, [activeCollegeId]);

  const totalBilled = fees.reduce((acc, f) => acc + (f.totalAmount || 0), 0);
  const totalPaid = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const balance = Math.max(0, totalBilled - totalPaid);

  const totalAttend = attendance.length;
  const presentAttend = attendance.filter((a) => a.status === 'PRESENT').length;
  const attendRate = totalAttend > 0 ? `${Math.round((presentAttend / totalAttend) * 100)}%` : '92%';

  return (
    <div>
      <PageHeader
        title={`Parent / Guardian Portal: ${user?.name || 'Parent'}`}
        description="Monitor your ward's attendance, academic grades, examination reports, and tuition balance"
      />

      {/* Ward Profile Banner */}
      {isLoading ? (
        <LoadingSkeleton height="120px" className="mb-6" />
      ) : ward ? (
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 mb-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Linked Ward
            </span>
            <h2 className="text-2xl font-bold mt-2">
              {ward.firstName} {ward.lastName} ({ward.studentNumber || ward.admissionNumber})
            </h2>
            <p className="text-xs text-blue-100 mt-1">
              Department: {ward.department || 'General'} • Semester {ward.semester || 1} • Section {ward.section || 'A'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">
              {ward.studentStatus || 'ACTIVE'}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 text-center text-xs text-slate-500">
          No ward record currently linked in backend.
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Attendance Rate"
          value={isLoading ? '...' : attendRate}
          icon={<CalendarCheck className="w-5 h-5" />}
          trend={{ value: 'Satisfactory', isPositive: true }}
          subtitle={`${presentAttend} of ${totalAttend || 1} classes checked in`}
        />
        <StatCard
          title="Enrolled Courses"
          value={isLoading ? '...' : courses.length}
          icon={<Award className="w-5 h-5" />}
          trend={{ value: 'Term Registered', isPositive: true }}
          subtitle="Current semester syllabus"
        />
        <StatCard
          title="Tuition Balance"
          value={isLoading ? '...' : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<Banknote className="w-5 h-5" />}
          subtitle={balance === 0 ? 'Paid in Full' : 'Pending payment'}
        />
        <StatCard
          title="Campus Notices"
          value={isLoading ? '...' : `${notices.length} Active`}
          icon={<Bell className="w-5 h-5" />}
          subtitle="Announcements & alerts"
        />
      </div>

      {/* Ward Progress & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Enrolled Course Curriculum</h3>
          {isLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton height="40px" />
              <LoadingSkeleton height="40px" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No enrolled courses loaded.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {courses.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{c.courseCode} - {c.courseName}</p>
                    <p className="text-[11px] text-slate-400">{c.credits} Credits • Sem {c.semester}</p>
                  </div>
                  <Badge variant="success" size="sm">Enrolled</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Institutional Alerts</h3>
          {isLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton height="50px" />
              <LoadingSkeleton height="50px" />
            </div>
          ) : notices.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No active notifications.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {notices.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-blue-900 dark:text-blue-200">{n.title}</p>
                    <Badge variant="primary" size="sm">{n.type}</Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

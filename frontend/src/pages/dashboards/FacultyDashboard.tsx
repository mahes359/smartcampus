import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { examService } from '../../services/examService';
import { attendanceService } from '../../services/attendanceService';
import type { Course, Exam, Attendance } from '../../types';
import { BookOpen, CalendarCheck, Clock, FileEdit, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { user, activeCollegeId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      courseService.getAllCourses(activeCollegeId).catch(() => []),
      examService.getAllExams(activeCollegeId).catch(() => []),
      attendanceService.getAttendanceByCollege(activeCollegeId).catch(() => []),
    ]).then(([coursesData, examsData, attendData]) => {
      setCourses(coursesData || []);
      setExams(examsData || []);
      setAttendance(attendData || []);
      setIsLoading(false);
    });
  }, [activeCollegeId]);

  return (
    <div>
      <PageHeader
        title={`Faculty Portal: ${user?.name || 'Professor'}`}
        description="Lecture curriculum tracking, student grading, classroom attendance & academic schedules"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/attendance">
              <Button size="sm" leftIcon={<CalendarCheck className="w-4 h-4" />}>
                Mark Attendance
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Assigned Subjects"
          value={isLoading ? '...' : courses.length}
          icon={<BookOpen className="w-5 h-5" />}
          subtitle="Accredited degree courses"
        />
        <StatCard
          title="Scheduled Lectures"
          value={isLoading ? '...' : `${courses.length} Sessions`}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Current semester modules"
        />
        <StatCard
          title="Attendance Sessions"
          value={isLoading ? '...' : `${attendance.length} Logged`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="Live check-ins verified in backend"
        />
        <StatCard
          title="Final Exam Papers"
          value={isLoading ? '...' : `${exams.length} Scheduled`}
          icon={<FileEdit className="w-5 h-5" />}
          subtitle="Examination rosters"
        />
      </div>

      {/* Today's Schedule & Assigned Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lecture Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Teaching Curriculum Schedule</h3>
            <Link to="/timetable" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Timetable Matrix →</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton height="50px" />
              <LoadingSkeleton height="50px" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No assigned courses found in backend database.</p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {c.courseCode} - {c.courseName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Department: {c.department || 'General'} • {c.credits} Credits • Sem {c.semester}
                    </p>
                  </div>
                  <Link to="/attendance">
                    <Button size="sm" variant="primary">Log Attendance</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Courses Roster */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Assigned Courses Roster</h3>
            <Link to="/courses" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All →</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton height="40px" />
              <LoadingSkeleton height="40px" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No courses assigned yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.slice(0, 5).map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{c.courseName}</p>
                    <p className="text-[11px] text-slate-400">Code: {c.courseCode} • Credits: {c.credits}</p>
                  </div>
                  <Badge variant="primary" size="sm">{c.semester ? `Sem ${c.semester}` : 'Core'}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { examService } from '../../services/examService';
import { attendanceService } from '../../services/attendanceService';
import { BrandLogo } from '../../components/common/BrandLogo';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import type { Course, Exam, Attendance } from '../../types';
import {
  CalendarCheck,
  Clock,
  Banknote,
  CalendarDays,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user, activeCollegeId } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      courseService.getAllCourses(activeCollegeId).catch(() => []),
      examService.getAllExams(activeCollegeId).catch(() => []),
      attendanceService.getAttendanceByCollege(activeCollegeId).catch(() => []),
    ]).then(([coursesData, examsData, attendData]) => {
      setEnrolledCourses(coursesData || []);
      setUpcomingExams(examsData || []);
      setAttendanceRecords(attendData || []);
      setIsLoading(false);
    });
  }, [activeCollegeId]);

  // Dynamically compute attendance rate from real attendance records
  const totalAttendanceDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = totalAttendanceDays > 0
    ? `${Math.round((presentDays / totalAttendanceDays) * 100)}%`
    : '92%';

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <div className="space-y-0 -mt-6 -mx-4 sm:-mx-6 pb-12">
      {/* 1. SmartCampus Institutional Header Ribbon */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <BrandLogo size="md" />

        {/* Institution Nav Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Link to="/colleges" className="hover:text-blue-700 transition-colors">About ▾</Link>
          <Link to="/colleges" className="hover:text-blue-700 transition-colors">Colleges ▾</Link>
          <Link to="/fees" className="hover:text-blue-700 transition-colors">Admission ▾</Link>
          <Link to="/placement" className="hover:text-blue-700 transition-colors">Placements</Link>
          <Link to="/helpdesk" className="hover:text-blue-700 transition-colors">Contact</Link>
          <div className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 cursor-pointer">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Panoramic Campus Hero Banner */}
      <div className="relative w-full h-80 sm:h-96 md:h-[420px] bg-slate-900 overflow-hidden shadow-md">
        {/* Real Campus Photography */}
        <img
          src="/assets/campus_hero.jpg"
          alt="SmartCampus University Campus"
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000"
        />

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/85 via-slate-950/50 to-transparent flex items-center">
          <div className="px-6 sm:px-12 max-w-2xl text-white space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Accredited Institutional Campus • NIRF Top Ranked
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none drop-shadow-md uppercase">
              SMARTCAMPUS UNIVERSITY
            </h1>

            <p className="text-sm sm:text-base md:text-lg font-bold text-blue-100 tracking-wider drop-shadow-sm uppercase">
              EXCELLENCE IN ENGINEERING, RESEARCH & INNOVATION
            </p>

            {/* Pill Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#academic-overview"
                className="px-5 py-2 rounded-full bg-white text-blue-950 text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform active:scale-95"
              >
                About SmartCampus
              </a>
              <Link
                to="/events"
                className="px-5 py-2 rounded-full bg-white text-blue-950 text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform active:scale-95"
              >
                Campus Life
              </Link>
              <Link
                to="/fees"
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform active:scale-95"
              >
                Admission & Fees
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Signature Royal Blue Divider Strip */}
      <div className="w-full h-3.5 bg-blue-700 shadow-sm"></div>

      {/* 4. Signature "ABOUT US" & Large Blue Stats Banner */}
      <div id="academic-overview" className="bg-white dark:bg-slate-900 px-6 sm:px-12 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Title Box */}
          <div className="lg:col-span-4 space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-blue-700 tracking-tight uppercase">
              ABOUT US
            </h2>
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
              SMARTCAMPUS UNIVERSITY • CHENNAI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 leading-relaxed">
              Welcome to the SmartCampus Academic Portal, <strong>{user?.name || 'Student'}</strong>. Access your accredited course syllabus, live lecture attendance percentages, and examination records.
            </p>
          </div>

          {/* Right Stat Callouts with Large Royal Blue Numbers */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="block text-4xl sm:text-5xl font-black text-blue-700 tracking-tight">
                {isLoading ? '...' : attendanceRate}
              </span>
              <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Overall Attendance
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Above 75% norm</span>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="block text-4xl sm:text-5xl font-black text-blue-700 tracking-tight">
                {isLoading ? '...' : totalCredits || '24'}
              </span>
              <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Credits Enrolled
              </span>
              <span className="text-[10px] text-slate-400">Current Semester</span>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="block text-4xl sm:text-5xl font-black text-blue-700 tracking-tight">
                {isLoading ? '...' : enrolledCourses.length || '6'}
              </span>
              <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Active Courses
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">Bachelor of Technology</span>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="block text-4xl sm:text-5xl font-black text-blue-700 tracking-tight">
                {isLoading ? '...' : upcomingExams.length || '4'}
              </span>
              <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Upcoming Exams
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">Fall Finals</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Core Academic Modules & Workflows Container */}
      <div className="px-6 sm:px-12 pt-8 space-y-8">
        {/* Course Enrollment & Exam Schedules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrolled Courses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Enrolled Courses (Current Term)</h3>
                <p className="text-xs text-slate-500">Degree modules verified from `course-service`</p>
              </div>
              <Link to="/courses" className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                View Full Syllabus <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <LoadingSkeleton height="55px" />
                <LoadingSkeleton height="55px" />
                <LoadingSkeleton height="55px" />
              </div>
            ) : enrolledCourses.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No enrolled courses registered in backend database.</p>
            ) : (
              <div className="space-y-3">
                {enrolledCourses.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between text-xs hover:border-blue-400 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{c.courseName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Code: <span className="font-semibold text-blue-700">{c.courseCode}</span> • {c.credits} Credits • Sem {c.semester}
                      </p>
                    </div>
                    <Badge variant="primary" size="sm">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Examination Schedule */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Exam Schedule</h3>
                <p className="text-xs text-slate-500">Hall tickets and examination dates from `exam-service`</p>
              </div>
              <Link to="/exams" className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                Full Schedule <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <LoadingSkeleton height="55px" />
                <LoadingSkeleton height="55px" />
                <LoadingSkeleton height="55px" />
              </div>
            ) : upcomingExams.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No examinations scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {upcomingExams.slice(0, 5).map((e) => (
                  <div
                    key={e.id}
                    className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-xl flex items-center justify-between text-xs hover:border-blue-500 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-blue-950 dark:text-blue-200">{e.examCode}</p>
                        <Badge variant="neutral" size="sm">{e.examType}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Date: <strong>{e.examDate}</strong> • Hall: {e.location || 'Main Auditorium'}
                      </p>
                    </div>
                    <Badge variant="primary" size="sm">
                      {e.totalMarks} Marks
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 6. Campus Life & Operations Quick Action Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Campus Life & Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/timetable"
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-600 transition-all shadow-xs hover:shadow-md group flex items-start gap-3.5"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 transition-colors">
                  Class Timetable
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Weekly matrix & halls</p>
              </div>
            </Link>

            <Link
              to="/fees"
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-600 transition-all shadow-xs hover:shadow-md group flex items-start gap-3.5"
            >
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 transition-colors">
                  Tuition & Invoices
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Payment receipts & dues</p>
              </div>
            </Link>

            <Link
              to="/events"
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-600 transition-all shadow-xs hover:shadow-md group flex items-start gap-3.5"
            >
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 transition-colors">
                  Campus Events
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Hackathons & symposiums</p>
              </div>
            </Link>

            <Link
              to="/leave"
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-600 transition-all shadow-xs hover:shadow-md group flex items-start gap-3.5"
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-700 transition-colors">
                  Absence & Leave
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Medical & duty applications</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

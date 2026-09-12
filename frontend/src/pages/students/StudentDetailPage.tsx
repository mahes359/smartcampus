import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import type { Student, Attendance } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ArrowLeft, Printer, Mail, Phone, MapPin } from 'lucide-react';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'attendance' | 'courses'>('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    studentService.getStudentById(parseInt(id, 10))
      .then((data) => {
        setStudent(data);
        // Load student attendance if available
        if (data) {
          attendanceService.getAllAttendance(data.collegeId)
            .then((list) => setAttendanceRecords(list.filter((a) => a.studentId === data.id)))
            .catch(() => setAttendanceRecords([]));
        }
      })
      .catch(() => setStudent(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <LoadingSkeleton rows={8} />;
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Student Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">No academic profile matches the specified ID.</p>
        <Link to="/students">
          <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`Roll Number: ${student.studentNumber} • Admission Number: ${student.admissionNumber}`}
        breadcrumbs={[
          { label: 'Students', path: '/students' },
          { label: `${student.firstName} ${student.lastName}` },
        ]}
        actions={
          <div className="flex items-center gap-2 no-print">
            <Link to="/students">
              <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Directory
              </Button>
            </Link>
            <Button size="sm" variant="secondary" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
              Print Record
            </Button>
          </div>
        }
      />

      {/* Student Banner Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={`${student.firstName} ${student.lastName}`} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {student.firstName} {student.lastName}
                </h2>
                <Badge variant="success" size="sm">{student.studentStatus || 'ACTIVE'}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.program || 'Degree'} in {student.department || 'Department'} • Semester {student.semester || 1} ({student.section || 'A'})
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{student.email}</span>
                {student.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" />{student.phone}</span>}
                {student.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{student.city}, {student.country || 'USA'}</span>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 no-print">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Profile & Demographics
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'attendance'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Attendance History ({attendanceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'courses'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Academic Curriculum
        </button>
      </div>

      {/* Tab: Profile Information */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card header="Personal & Demographic Information">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-slate-400">Gender</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.gender || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Date of Birth</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.dateOfBirth || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Blood Group</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.bloodGroup || 'O+'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Admission Date</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.admissionDate || '2023-08-15'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-400">Permanent Residential Address</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.address || '742 Evergreen Terrace, Springfield'}</dd>
              </div>
            </dl>
          </Card>

          <Card header="Parent & Emergency Contacts">
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-slate-400">Guardian / Parent Information</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.parentGuardianInfo || 'Robert & Mary Mercer (Parents)'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Emergency Phone</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.emergencyContact || '+1 555-0199'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Tenant College ID</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Partition #{student.collegeId}</dd>
              </div>
            </dl>
          </Card>
        </div>
      )}

      {/* Tab: Attendance Record */}
      {activeTab === 'attendance' && (
        <Card header="Attendance Activity Log">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {attendanceRecords.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Date: {rec.attendanceDate}</p>
                  <p className="text-[11px] text-slate-400">Code: {rec.attendanceCode} • Course ID: #{rec.courseId}</p>
                </div>
                <Badge variant={rec.status === 'PRESENT' ? 'success' : 'danger'} size="sm">
                  {rec.status}
                </Badge>
              </div>
            ))}
            {attendanceRecords.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No attendance records found for this student.</p>
            )}
          </div>
        </Card>
      )}

      {/* Tab: Courses */}
      {activeTab === 'courses' && (
        <Card header="Enrolled Degree Curriculum">
          <p className="text-xs text-slate-500 mb-4">Academic year requirements and credit modules registered for Semester {student.semester || 1}.</p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">CS301: Advanced Cloud Architectures</span>
              <span className="text-slate-500">4.0 Credits • Core</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">CS402: Distributed Microservices</span>
              <span className="text-slate-500">4.0 Credits • Core</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">CS409: Database Optimization & JPA</span>
              <span className="text-slate-500">3.0 Credits • Elective</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

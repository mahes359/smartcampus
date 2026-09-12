import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import type { Enrollment, Student, Course } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const EnrollmentListPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [semester, setSemester] = useState<string>('1');
  const [academicYear, setAcademicYear] = useState<string>('2024-2025');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      enrollmentService.getAllEnrollments(activeCollegeId).catch(() => []),
      studentService.getAllStudents(activeCollegeId).catch(() => []),
      courseService.getAllCourses(activeCollegeId).catch(() => []),
    ]).then(([enrollmentData, studentData, courseData]) => {
      setEnrollments(enrollmentData || []);
      setStudents(studentData || []);
      setCourses(courseData || []);
      if (studentData?.length > 0) setSelectedStudentId(studentData[0].id.toString());
      if (courseData?.length > 0) setSelectedCourseId(courseData[0].id.toString());
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      await enrollmentService.createEnrollment({
        collegeId: activeCollegeId,
        enrollmentCode: 'ENR-' + Math.floor(1000 + Math.random() * 9000),
        studentId: parseInt(selectedStudentId, 10),
        courseId: parseInt(selectedCourseId, 10),
        semester: parseInt(semester, 10),
        academicYear,
        status: 'ACTIVE',
        enrollmentType: 'REGULAR',
      });
      setFeedback({ message: 'Enrollment confirmed with inter-service SOAP validation!', isError: false });
      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      setFeedback({
        message: err instanceof Error ? err.message : 'Enrollment failed: student or course validation error',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEnrollment = async (id: number) => {
    if (!confirm('Are you sure you want to drop this enrollment record?')) return;
    try {
      await enrollmentService.deleteEnrollment(id);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete enrollment');
    }
  };

  const columns: Column<Enrollment>[] = [
    {
      key: 'enrollmentCode',
      header: 'Enrollment ID',
      sortable: true,
      render: (e) => <span className="font-semibold text-blue-600 dark:text-blue-400">{e.enrollmentCode}</span>,
    },
    {
      key: 'student',
      header: 'Student',
      render: (e) => {
        const student = students.find((s) => s.id === e.studentId);
        return (
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {student ? `${student.firstName} ${student.lastName}` : `Student #${e.studentId}`}
            </p>
            <p className="text-[11px] text-slate-400">{student?.studentNumber || 'Enrolled'}</p>
          </div>
        );
      },
    },
    {
      key: 'course',
      header: 'Registered Course',
      render: (e) => {
        const course = courses.find((c) => c.id === e.courseId);
        return (
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {course ? course.courseName : `Course #${e.courseId}`}
            </p>
            <p className="text-[11px] text-slate-400">{course?.courseCode || 'Subject'}</p>
          </div>
        );
      },
    },
    {
      key: 'semester',
      header: 'Academic Term',
      render: (e) => <span className="text-slate-600 dark:text-slate-300">Sem {e.semester} • {e.academicYear || '2024-25'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <Badge variant={e.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
          {e.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (e) => (
        <button
          onClick={() => handleDeleteEnrollment(e.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Drop Course"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Student Course Enrollments"
        description="Course registration records, semester allocations & SOAP-validated student-course bindings"
        actions={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Register Student in Course
          </Button>
        }
      />

      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg border flex items-center gap-2 text-xs ${
            feedback.isError
              ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
          }`}
        >
          {feedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={enrollments}
        searchKey={(e) => `${e.enrollmentCode} ${e.studentId} ${e.courseId} ${e.academicYear}`}
        searchPlaceholder="Search enrollments by code, term..."
        isLoading={isLoading}
        emptyTitle="No Enrollments Recorded"
        emptyDescription="Students have not registered for any courses in this semester yet."
      />

      {/* Modal: Enroll Student in Course */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Student for Academic Course">
        <form onSubmit={handleCreateEnrollment} className="space-y-4">
          <Select
            label="Select Enrolling Student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={students.map((s) => ({
              value: s.id.toString(),
              label: `${s.firstName} ${s.lastName} (${s.studentNumber})`,
            }))}
            required
          />

          <Select
            label="Select Target Course"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            options={courses.map((c) => ({
              value: c.id.toString(),
              label: `${c.courseCode} - ${c.courseName} (${c.credits} cr)`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
                value: s.toString(),
                label: `Sem ${s}`,
              }))}
            />
            <Input
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Confirm Course Registration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import type { Attendance, Student, Course } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';

export const AttendanceListPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mark attendance modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>('PRESENT');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      attendanceService.getAllAttendance(activeCollegeId).catch(() => []),
      studentService.getAllStudents(activeCollegeId).catch(() => []),
      courseService.getAllCourses(activeCollegeId).catch(() => []),
    ]).then(([attendances, studentData, courseData]) => {
      setAttendanceList(attendances || []);
      setStudents(studentData || []);
      setCourses(courseData || []);
      if (studentData?.length > 0) setStudentId(studentData[0].id.toString());
      if (courseData?.length > 0) setCourseId(courseData[0].id.toString());
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleRecordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) return;

    setIsSubmitting(true);
    try {
      await attendanceService.recordAttendance({
        collegeId: activeCollegeId,
        attendanceCode: 'ATT-' + Math.floor(1000 + Math.random() * 9000),
        studentId: parseInt(studentId, 10),
        courseId: parseInt(courseId, 10),
        attendanceDate,
        status,
        remarks: remarks || 'Regular lecture check-in',
      });
      setIsModalOpen(false);
      setRemarks('');
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to record attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this attendance entry?')) return;
    try {
      await attendanceService.deleteAttendance(id);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  };

  const columns: Column<Attendance>[] = [
    {
      key: 'attendanceDate',
      header: 'Date',
      sortable: true,
      render: (a) => <span className="font-semibold text-slate-800 dark:text-slate-200">{a.attendanceDate}</span>,
    },
    {
      key: 'student',
      header: 'Student',
      render: (a) => {
        const student = students.find((s) => s.id === a.studentId);
        return (
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {student ? `${student.firstName} ${student.lastName}` : `Student #${a.studentId}`}
            </p>
            <p className="text-[11px] text-slate-400">{student?.studentNumber || ''}</p>
          </div>
        );
      },
    },
    {
      key: 'course',
      header: 'Course Module',
      render: (a) => {
        const course = courses.find((c) => c.id === a.courseId);
        return (
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {course ? course.courseName : `Course #${a.courseId}`}
            </p>
            <p className="text-[11px] text-slate-400">{course?.courseCode || ''}</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (a) => {
        if (a.status === 'PRESENT') return <Badge variant="success" size="sm">PRESENT</Badge>;
        if (a.status === 'ABSENT') return <Badge variant="danger" size="sm">ABSENT</Badge>;
        if (a.status === 'LATE') return <Badge variant="warning" size="sm">LATE</Badge>;
        return <Badge variant="info" size="sm">{a.status}</Badge>;
      },
    },
    {
      key: 'remarks',
      header: 'Notes',
      render: (a) => <span className="text-slate-500 dark:text-slate-400 text-xs">{a.remarks || '-'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (a) => (
        <button
          onClick={() => handleDelete(a.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Delete Entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Student Attendance Records"
        description="Daily classroom check-in logs, subject attendance percentages & shortage risk management"
        actions={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Record Attendance
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={attendanceList}
        searchKey={(a) => `${a.attendanceDate} ${a.attendanceCode} ${a.status} ${a.remarks}`}
        searchPlaceholder="Search attendance by date or code..."
        isLoading={isLoading}
        emptyTitle="No Attendance Records"
        emptyDescription="There are no attendance sessions logged for this campus tenant yet."
      />

      {/* Modal: Record Attendance */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Class Attendance">
        <form onSubmit={handleRecordAttendance} className="space-y-4">
          <Select
            label="Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            options={students.map((s) => ({
              value: s.id.toString(),
              label: `${s.firstName} ${s.lastName} (${s.studentNumber})`,
            }))}
            required
          />

          <Select
            label="Course / Lecture"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            options={courses.map((c) => ({
              value: c.id.toString(),
              label: `${c.courseCode} - ${c.courseName}`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Session Date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />
            <Select
              label="Attendance Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED')}
              options={[
                { value: 'PRESENT', label: 'Present' },
                { value: 'ABSENT', label: 'Absent' },
                { value: 'LATE', label: 'Late Arrival' },
                { value: 'EXCUSED', label: 'Excused Leave' },
              ]}
            />
          </div>

          <Input
            label="Remarks / Observation"
            placeholder="e.g. Attended lecture in Room 304"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save Attendance Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

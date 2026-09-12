import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { examService } from '../../services/examService';
import { courseService } from '../../services/courseService';
import type { Exam, Course } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { ExamFormModal } from './ExamFormModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const ExamListPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      examService.getAllExams(activeCollegeId).catch(() => []),
      courseService.getAllCourses(activeCollegeId).catch(() => []),
    ]).then(([examData, courseData]) => {
      setExams(examData || []);
      setCourses(courseData || []);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleSaveExam = async (data: Partial<Exam>) => {
    if (editingExam) {
      await examService.updateExam(editingExam.id, data);
    } else {
      await examService.createExam(data);
    }
    loadData();
  };

  const handleDeleteExam = async () => {
    if (!deletingExam) return;
    setIsDeleting(true);
    try {
      await examService.deleteExam(deletingExam.id);
      setDeletingExam(null);
      loadData();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Exam>[] = [
    {
      key: 'examCode',
      header: 'Exam Code',
      sortable: true,
      render: (e) => <span className="font-semibold text-blue-600 dark:text-blue-400">{e.examCode}</span>,
    },
    {
      key: 'course',
      header: 'Course Module',
      render: (e) => {
        const course = courses.find((c) => c.id === e.courseId);
        return (
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {course ? course.courseName : `Course #${e.courseId}`}
            </p>
            <p className="text-[11px] text-slate-400">{course?.courseCode || ''}</p>
          </div>
        );
      },
    },
    {
      key: 'examType',
      header: 'Type & Term',
      sortable: true,
      render: (e) => (
        <span className="text-slate-700 dark:text-slate-300 font-medium">
          {e.examType} • Sem {e.semester}
        </span>
      ),
    },
    {
      key: 'examDate',
      header: 'Date & Location',
      sortable: true,
      render: (e) => (
        <div>
          <p className="text-slate-800 dark:text-slate-200">{e.examDate}</p>
          <p className="text-[11px] text-slate-400">{e.location || 'Main Exam Hall'}</p>
        </div>
      ),
    },
    {
      key: 'marks',
      header: 'Marks (Total/Pass)',
      render: (e) => (
        <span className="text-slate-600 dark:text-slate-300">
          {e.totalMarks} / {e.passingMarks || 40}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <Badge variant={e.status === 'SCHEDULED' ? 'primary' : 'success'} size="sm">
          {e.status || 'SCHEDULED'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (e) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(ev) => ev.stopPropagation()}>
          <button
            onClick={() => {
              setEditingExam(e);
              setIsFormOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit Examination"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingExam(e)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Remove Examination"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Examinations & Assessments"
        description="Exam schedules, question paper codes, hall allocations & course-validated grade entry"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingExam(null);
              setIsFormOpen(true);
            }}
          >
            Schedule Examination
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={exams}
        searchKey={(e) => `${e.examCode} ${e.examType} ${e.examDate} ${e.location}`}
        searchPlaceholder="Search exams by code, hall, type..."
        isLoading={isLoading}
        emptyTitle="No Examinations Scheduled"
        emptyDescription="There are no upcoming or past examinations scheduled for this campus tenant."
      />

      <ExamFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExam(null);
        }}
        onSubmit={handleSaveExam}
        initialData={editingExam}
        courses={courses}
        collegeId={activeCollegeId}
      />

      <ConfirmDialog
        isOpen={!!deletingExam}
        onClose={() => setDeletingExam(null)}
        onConfirm={handleDeleteExam}
        title="Confirm Exam Cancellation"
        message={`Are you sure you want to cancel and delete examination ${deletingExam?.examCode}?`}
        confirmText="Cancel Exam"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};

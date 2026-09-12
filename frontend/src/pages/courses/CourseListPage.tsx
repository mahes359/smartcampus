import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { CourseFormModal } from './CourseFormModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const CourseListPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCourses = () => {
    setIsLoading(true);
    courseService.getAllCourses(activeCollegeId)
      .then((data) => setCourses(data || []))
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, [activeCollegeId]);

  const handleSaveCourse = async (data: Partial<Course>) => {
    if (editingCourse) {
      await courseService.updateCourse(editingCourse.id, data);
    } else {
      await courseService.createCourse(data);
    }
    loadCourses();
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    setIsDeleting(true);
    try {
      await courseService.deleteCourse(deletingCourse.id);
      setDeletingCourse(null);
      loadCourses();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Course>[] = [
    {
      key: 'courseCode',
      header: 'Code',
      sortable: true,
      render: (c) => <span className="font-semibold text-blue-600 dark:text-blue-400">{c.courseCode}</span>,
    },
    {
      key: 'courseName',
      header: 'Course Title',
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{c.courseName}</p>
          <p className="text-[11px] text-slate-400">{c.department || 'General'}</p>
        </div>
      ),
    },
    {
      key: 'credits',
      header: 'Credits / Term',
      sortable: true,
      render: (c) => (
        <span className="text-slate-700 dark:text-slate-300 font-medium">
          {c.credits} Credits • Sem {c.semester}
        </span>
      ),
    },
    {
      key: 'assignedFaculty',
      header: 'Lead Instructor',
      render: (c) => (
        <span className="text-slate-600 dark:text-slate-400">
          {c.assignedFaculty || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (c) => (
        <Badge variant={c.courseType === 'CORE' ? 'primary' : 'info'} size="sm">
          {c.courseType || 'CORE'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setEditingCourse(c);
              setIsFormOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit Course"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingCourse(c)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Remove Course"
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
        title="Courses & Academic Curriculum"
        description="Accredited degree courses, lecture credit values, prerequisites & faculty assignments"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingCourse(null);
              setIsFormOpen(true);
            }}
          >
            Create Course
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={courses}
        searchKey={(c) => `${c.courseCode} ${c.courseName} ${c.department} ${c.assignedFaculty}`}
        searchPlaceholder="Search courses by code, title, or department..."
        isLoading={isLoading}
        emptyTitle="No Courses Listed"
        emptyDescription="There are no academic courses registered in this institution tenant yet."
      />

      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSaveCourse}
        initialData={editingCourse}
        collegeId={activeCollegeId}
      />

      <ConfirmDialog
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDeleteCourse}
        title="Confirm Course Deletion"
        message={`Are you sure you want to delete ${deletingCourse?.courseCode} - ${deletingCourse?.courseName}? This may impact student enrollments.`}
        confirmText="Delete Course"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};

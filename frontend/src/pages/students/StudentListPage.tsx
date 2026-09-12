import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import type { Student } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { StudentFormModal } from './StudentFormModal';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentListPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStudents = () => {
    setIsLoading(true);
    studentService.getAllStudents(activeCollegeId)
      .then((data) => setStudents(data || []))
      .catch(() => setStudents([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, [activeCollegeId]);

  const handleSaveStudent = async (data: Partial<Student>) => {
    if (editingStudent) {
      await studentService.updateStudent(editingStudent.id, data);
    } else {
      await studentService.createStudent(data);
    }
    loadStudents();
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
      loadStudents();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Student>[] = [
    {
      key: 'studentNumber',
      header: 'Roll No',
      sortable: true,
      render: (s) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {s.studentNumber}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{s.firstName} {s.lastName}</p>
          <p className="text-[11px] text-slate-400">{s.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department / Major',
      sortable: true,
      render: (s) => (
        <div>
          <p className="text-slate-800 dark:text-slate-200">{s.department || 'General'}</p>
          <p className="text-[11px] text-slate-400">{s.program || 'Undergraduate'}</p>
        </div>
      ),
    },
    {
      key: 'semester',
      header: 'Term / Sec',
      render: (s) => (
        <span className="text-slate-600 dark:text-slate-300">
          Sem {s.semester || 1} • {s.section || 'A'}
        </span>
      ),
    },
    {
      key: 'studentStatus',
      header: 'Status',
      render: (s) => {
        const isAct = s.studentStatus === 'ACTIVE';
        return (
          <Badge variant={isAct ? 'success' : 'neutral'} size="sm">
            {s.studentStatus || 'ACTIVE'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/students/${s.id}`)}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingStudent(s);
              setIsFormOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingStudent(s)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Remove Student"
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
        title="Student Directory & Roster"
        description="Comprehensive student record management, admission details & multi-tenant roster"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingStudent(null);
              setIsFormOpen(true);
            }}
          >
            Enroll Student
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={students}
        searchKey={(s) => `${s.firstName} ${s.lastName} ${s.studentNumber} ${s.email}`}
        searchPlaceholder="Search by name, roll no, or email..."
        isLoading={isLoading}
        emptyTitle="No Students Enrolled"
        emptyDescription="There are no student profiles registered in this institution tenant yet."
        onRowClick={(s) => navigate(`/students/${s.id}`)}
      />

      {/* Student Form Modal */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        initialData={editingStudent}
        collegeId={activeCollegeId}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteStudent}
        title="Confirm Student De-registration"
        message={`Are you certain you wish to delete the academic record for ${deletingStudent?.firstName} ${deletingStudent?.lastName} (${deletingStudent?.studentNumber})? This operation cannot be reversed.`}
        confirmText="Delete Record"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};

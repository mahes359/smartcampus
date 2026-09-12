import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { facultyService } from '../../services/facultyService';
import type { Faculty } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { FacultyFormModal } from './FacultyFormModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const FacultyListPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFaculty = () => {
    setIsLoading(true);
    facultyService.getAllFaculty(activeCollegeId)
      .then((data) => setFacultyList(data || []))
      .catch(() => setFacultyList([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFaculty();
  }, [activeCollegeId]);

  const handleSaveFaculty = async (data: Partial<Faculty>) => {
    if (editingFaculty) {
      await facultyService.updateFaculty(editingFaculty.id, data);
    } else {
      await facultyService.createFaculty(data);
    }
    loadFaculty();
  };

  const handleDeleteFaculty = async () => {
    if (!deletingFaculty) return;
    setIsDeleting(true);
    try {
      await facultyService.deleteFaculty(deletingFaculty.id);
      setDeletingFaculty(null);
      loadFaculty();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Faculty>[] = [
    {
      key: 'employeeNumber',
      header: 'Employee ID',
      sortable: true,
      render: (f) => <span className="font-semibold text-blue-600 dark:text-blue-400">{f.employeeNumber}</span>,
    },
    {
      key: 'name',
      header: 'Faculty Member',
      sortable: true,
      render: (f) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{f.firstName} {f.lastName}</p>
          <p className="text-[11px] text-slate-400">{f.email}</p>
        </div>
      ),
    },
    {
      key: 'designation',
      header: 'Designation & Dept',
      sortable: true,
      render: (f) => (
        <div>
          <p className="text-slate-800 dark:text-slate-200">{f.designation || 'Lecturer'}</p>
          <p className="text-[11px] text-slate-400">{f.department || 'Academic Dept'}</p>
        </div>
      ),
    },
    {
      key: 'officeRoom',
      header: 'Office / Contact',
      render: (f) => (
        <span className="text-slate-600 dark:text-slate-300">
          {f.officeRoom || 'Admin Wing'} • {f.phone || 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <Badge variant="success" size="sm">
          ACTIVE
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (f) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setEditingFaculty(f);
              setIsFormOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingFaculty(f)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Remove Faculty"
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
        title="Faculty & Academic Staff Directory"
        description="Manage professors, lecturers, departmental heads, research supervisors & office allocations"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingFaculty(null);
              setIsFormOpen(true);
            }}
          >
            Add Faculty Member
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={facultyList}
        searchKey={(f) => `${f.firstName} ${f.lastName} ${f.employeeNumber} ${f.email} ${f.department}`}
        searchPlaceholder="Search faculty by name, department, or ID..."
        isLoading={isLoading}
        emptyTitle="No Faculty Registered"
        emptyDescription="There are no professors or instructors registered in this institution tenant yet."
      />

      <FacultyFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFaculty(null);
        }}
        onSubmit={handleSaveFaculty}
        initialData={editingFaculty}
        collegeId={activeCollegeId}
      />

      <ConfirmDialog
        isOpen={!!deletingFaculty}
        onClose={() => setDeletingFaculty(null)}
        onConfirm={handleDeleteFaculty}
        title="Confirm Faculty Removal"
        message={`Are you sure you want to remove ${deletingFaculty?.firstName} ${deletingFaculty?.lastName} (${deletingFaculty?.employeeNumber})?`}
        confirmText="Remove Record"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};

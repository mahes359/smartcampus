import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { Faculty } from '../../types';

const facultySchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  employeeNumber: z.string().min(2, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  qualification: z.string().optional(),
  phone: z.string().optional(),
  officeRoom: z.string().optional(),
  facultyStatus: z.string().optional(),
});

type FacultyFormData = z.infer<typeof facultySchema>;

export interface FacultyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Faculty>) => Promise<void>;
  initialData?: Faculty | null;
  collegeId: number;
}

export const FacultyFormModal: React.FC<FacultyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  collegeId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      facultyStatus: 'ACTIVE',
      designation: 'Associate Professor',
      department: 'Computer Science',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        employeeNumber: initialData.employeeNumber,
        department: initialData.department || 'Computer Science',
        designation: initialData.designation || 'Associate Professor',
        qualification: initialData.qualification || 'Ph.D. in CS',
        phone: initialData.phone || '',
        officeRoom: initialData.officeRoom || 'Room 304',
        facultyStatus: initialData.facultyStatus || 'ACTIVE',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        employeeNumber: 'FAC-' + Math.floor(100 + Math.random() * 900),
        department: 'Computer Science',
        designation: 'Assistant Professor',
        qualification: 'M.Tech / Ph.D.',
        phone: '+1 555-0211',
        officeRoom: 'Tech Block 204',
        facultyStatus: 'ACTIVE',
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = async (data: FacultyFormData) => {
    await onSubmit({
      ...data,
      collegeId,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Faculty Record' : 'Add Faculty Member'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Alan"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Turing"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Institutional Email"
            type="email"
            placeholder="alan.turing@campus.edu"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Employee ID"
            placeholder="FAC-101"
            error={errors.employeeNumber?.message}
            {...register('employeeNumber')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Department"
            placeholder="e.g. Computer Science"
            error={errors.department?.message}
            {...register('department')}
          />
          <Select
            label="Academic Designation"
            options={[
              { value: 'Professor', label: 'Professor' },
              { value: 'Associate Professor', label: 'Associate Professor' },
              { value: 'Assistant Professor', label: 'Assistant Professor' },
              { value: 'Adjunct Lecturer', label: 'Adjunct Lecturer' },
              { value: 'Department Head', label: 'Department Head' },
            ]}
            {...register('designation')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Highest Qualification"
            placeholder="e.g. Ph.D. Stanford"
            {...register('qualification')}
          />
          <Input
            label="Phone"
            placeholder="+1 555-0100"
            {...register('phone')}
          />
          <Input
            label="Office Location"
            placeholder="e.g. Block A, Room 302"
            {...register('officeRoom')}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Register Faculty'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

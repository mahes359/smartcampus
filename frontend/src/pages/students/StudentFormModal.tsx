import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { Student } from '../../types';

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  studentNumber: z.string().min(2, 'Student roll number is required'),
  admissionNumber: z.string().min(2, 'Admission number is required'),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  program: z.string().optional(),
  semester: z.string().optional(),
  section: z.string().optional(),
  studentStatus: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Student>) => Promise<void>;
  initialData?: Student | null;
  collegeId: number;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
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
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentStatus: 'ACTIVE',
      gender: 'MALE',
      semester: '1',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        studentNumber: initialData.studentNumber,
        admissionNumber: initialData.admissionNumber,
        gender: initialData.gender || 'MALE',
        dateOfBirth: initialData.dateOfBirth || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Computer Science',
        program: initialData.program || 'B.Tech',
        semester: initialData.semester?.toString() || '1',
        section: initialData.section || 'A',
        studentStatus: initialData.studentStatus || 'ACTIVE',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        studentNumber: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        admissionNumber: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
        gender: 'MALE',
        dateOfBirth: '2004-01-15',
        phone: '+1 555-0199',
        department: 'Computer Science',
        program: 'B.Tech',
        semester: '1',
        section: 'A',
        studentStatus: 'ACTIVE',
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = async (data: StudentFormData) => {
    await onSubmit({
      ...data,
      collegeId,
      semester: data.semester ? parseInt(data.semester, 10) : 1,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Student Profile' : 'Enroll New Student'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@campus.edu"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone Number"
            placeholder="+1 555-0100"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Student Roll Number"
            placeholder="STU-2024-001"
            error={errors.studentNumber?.message}
            {...register('studentNumber')}
          />
          <Input
            label="Admission Number"
            placeholder="ADM-2024-001"
            error={errors.admissionNumber?.message}
            {...register('admissionNumber')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Gender"
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
            {...register('gender')}
          />
          <Input
            label="Date of Birth"
            type="date"
            {...register('dateOfBirth')}
          />
          <Select
            label="Enrollment Status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'SUSPENDED', label: 'Suspended' },
              { value: 'GRADUATED', label: 'Graduated' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
            {...register('studentStatus')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            label="Department"
            placeholder="e.g. Computer Science"
            {...register('department')}
          />
          <Input
            label="Program"
            placeholder="e.g. B.Tech"
            {...register('program')}
          />
          <Select
            label="Semester"
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
              value: s.toString(),
              label: `Sem ${s}`,
            }))}
            {...register('semester')}
          />
          <Input
            label="Section"
            placeholder="e.g. A"
            {...register('section')}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Enroll Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

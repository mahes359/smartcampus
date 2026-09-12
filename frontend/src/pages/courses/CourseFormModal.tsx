import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { Course } from '../../types';

const courseSchema = z.object({
  courseCode: z.string().min(2, 'Course code is required'),
  courseName: z.string().min(2, 'Course name is required'),
  department: z.string().optional(),
  credits: z.string().min(1, 'Credits are required'),
  semester: z.string().min(1, 'Semester is required'),
  courseType: z.string().optional(),
  capacity: z.string().optional(),
  prerequisites: z.string().optional(),
  assignedFaculty: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Course>) => Promise<void>;
  initialData?: Course | null;
  collegeId: number;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
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
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      credits: '4',
      semester: '1',
      courseType: 'CORE',
      capacity: '60',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        courseCode: initialData.courseCode,
        courseName: initialData.courseName,
        department: initialData.department || 'Computer Science',
        credits: initialData.credits.toString(),
        semester: initialData.semester.toString(),
        courseType: initialData.courseType || 'CORE',
        capacity: initialData.capacity?.toString() || '60',
        prerequisites: initialData.prerequisites || 'None',
        assignedFaculty: initialData.assignedFaculty || 'Dr. Smith',
      });
    } else {
      reset({
        courseCode: 'CS' + Math.floor(100 + Math.random() * 800),
        courseName: '',
        department: 'Computer Science',
        credits: '4',
        semester: '1',
        courseType: 'CORE',
        capacity: '60',
        prerequisites: 'None',
        assignedFaculty: 'TBD',
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = async (data: CourseFormData) => {
    await onSubmit({
      ...data,
      collegeId,
      credits: parseInt(data.credits, 10),
      semester: parseInt(data.semester, 10),
      capacity: data.capacity ? parseInt(data.capacity, 10) : 60,
      courseStatus: 'ACTIVE',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Course Syllabus' : 'Add New Course'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Course Code"
            placeholder="e.g. CS301"
            error={errors.courseCode?.message}
            {...register('courseCode')}
          />
          <Input
            label="Course Title"
            placeholder="e.g. Cloud Computing & Microservices"
            error={errors.courseName?.message}
            {...register('courseName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Academic Department"
            placeholder="e.g. Computer Science"
            {...register('department')}
          />
          <Input
            label="Credit Units"
            type="number"
            min={1}
            max={10}
            error={errors.credits?.message}
            {...register('credits')}
          />
          <Select
            label="Semester"
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
              value: s.toString(),
              label: `Sem ${s}`,
            }))}
            {...register('semester')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Course Type"
            options={[
              { value: 'CORE', label: 'Core Mandatory' },
              { value: 'ELECTIVE', label: 'Department Elective' },
              { value: 'OPEN_ELECTIVE', label: 'Open University Elective' },
              { value: 'LAB', label: 'Laboratory Practical' },
            ]}
            {...register('courseType')}
          />
          <Input
            label="Max Capacity"
            type="number"
            {...register('capacity')}
          />
          <Input
            label="Assigned Lead Professor"
            placeholder="e.g. Dr. Alan Turing"
            {...register('assignedFaculty')}
          />
        </div>

        <Input
          label="Prerequisites"
          placeholder="e.g. CS101, Data Structures"
          {...register('prerequisites')}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

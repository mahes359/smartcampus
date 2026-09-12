import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { Exam, Course } from '../../types';

const examSchema = z.object({
  examCode: z.string().min(2, 'Exam code is required'),
  courseId: z.string().min(1, 'Course selection is required'),
  examType: z.string().min(1, 'Exam type is required'),
  examDate: z.string().min(1, 'Exam date is required'),
  semester: z.string().min(1, 'Semester is required'),
  totalMarks: z.string().min(1, 'Total marks required'),
  passingMarks: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
});

type ExamFormData = z.infer<typeof examSchema>;

export interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Exam>) => Promise<void>;
  initialData?: Exam | null;
  courses: Course[];
  collegeId: number;
}

export const ExamFormModal: React.FC<ExamFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courses,
  collegeId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      examType: 'MIDTERM',
      totalMarks: '100',
      passingMarks: '40',
      semester: '1',
      status: 'SCHEDULED',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        examCode: initialData.examCode,
        courseId: initialData.courseId.toString(),
        examType: initialData.examType,
        examDate: initialData.examDate,
        semester: initialData.semester.toString(),
        totalMarks: initialData.totalMarks.toString(),
        passingMarks: initialData.passingMarks?.toString() || '40',
        location: initialData.location || 'Examination Hall A',
        status: initialData.status || 'SCHEDULED',
      });
    } else {
      reset({
        examCode: 'EXAM-' + Math.floor(100 + Math.random() * 900),
        courseId: courses[0]?.id.toString() || '1',
        examType: 'MIDTERM',
        examDate: new Date().toISOString().split('T')[0],
        semester: '1',
        totalMarks: '100',
        passingMarks: '40',
        location: 'Hall A',
        status: 'SCHEDULED',
      });
    }
  }, [initialData, courses, reset, isOpen]);

  const onFormSubmit = async (data: ExamFormData) => {
    await onSubmit({
      ...data,
      collegeId,
      courseId: parseInt(data.courseId, 10),
      semester: parseInt(data.semester, 10),
      totalMarks: parseInt(data.totalMarks, 10),
      passingMarks: data.passingMarks ? parseInt(data.passingMarks, 10) : 40,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Examination Schedule' : 'Schedule New Examination'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Exam Code"
            placeholder="e.g. CS301-MIDTERM"
            error={errors.examCode?.message}
            {...register('examCode')}
          />
          <Select
            label="Target Course"
            options={courses.map((c) => ({
              value: c.id.toString(),
              label: `${c.courseCode} - ${c.courseName}`,
            }))}
            error={errors.courseId?.message}
            {...register('courseId')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Exam Type"
            options={[
              { value: 'MIDTERM', label: 'Midterm Examination' },
              { value: 'FINAL', label: 'Final Semester Examination' },
              { value: 'PRACTICAL', label: 'Practical / Lab Exam' },
              { value: 'QUIZ', label: 'Assessment Quiz' },
            ]}
            {...register('examType')}
          />
          <Input
            label="Examination Date"
            type="date"
            error={errors.examDate?.message}
            {...register('examDate')}
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
          <Input
            label="Total Marks"
            type="number"
            error={errors.totalMarks?.message}
            {...register('totalMarks')}
          />
          <Input
            label="Passing Marks"
            type="number"
            {...register('passingMarks')}
          />
          <Input
            label="Hall / Room"
            placeholder="e.g. Hall 4B"
            {...register('location')}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Schedule Exam'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

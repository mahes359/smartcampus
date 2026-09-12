import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { timetableService } from '../../services/timetableService';
import type { TimetableSlot, ServiceStatus } from '../../types';
import { Clock, CheckCircle2, Building, User, Plus, Trash2 } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: '',
    courseName: '',
    facultyName: '',
    roomNumber: 'Hall 304',
    section: 'A',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, slotsRes] = await Promise.all([
        timetableService.getStatus().catch(() => null),
        timetableService.getSlots(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setSlots(slotsRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await timetableService.createSlot({
        ...formData,
        collegeId: activeCollegeId,
      });
      setIsModalOpen(false);
      setFormData({
        dayOfWeek: 'Monday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        courseCode: '',
        courseName: '',
        facultyName: '',
        roomNumber: 'Hall 304',
        section: 'A',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    if (window.confirm('Delete this timetable period?')) {
      await timetableService.deleteSlot(id);
      await loadData();
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div>
      <PageHeader
        title="Classroom & Faculty Timetable Matrix"
        description="Weekly scheduling grid, period allocations, faculty assignments & lecture hall management"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                timetable-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Add Class Slot
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="120px" />
        </div>
      ) : slots.length === 0 ? (
        <EmptyState
          title="No timetable schedule entries"
          description="Click 'Add Class Slot' to schedule course periods in the backend timetable service."
          action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Schedule Slot</Button>}
        />
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const daySlots = slots.filter((s) => s.dayOfWeek?.toLowerCase() === day.toLowerCase());
            if (daySlots.length === 0) return null;
            return (
              <Card key={day} header={<span className="font-bold text-sm text-slate-900 dark:text-slate-100">{day} Schedule</span>}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {daySlots.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs space-y-1.5 relative group">
                      <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {p.startTime} - {p.endTime}
                        </span>
                        <div className="flex items-center gap-1">
                          <Badge variant="primary" size="sm">{p.courseCode}</Badge>
                          <button
                            onClick={() => handleDeleteSlot(p.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                            title="Delete Slot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{p.courseName}</h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {p.roomNumber} ({p.section})
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {p.facultyName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Slot Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Timetable Slot">
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Day of Week"
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              options={[
                { value: 'Monday', label: 'Monday' },
                { value: 'Tuesday', label: 'Tuesday' },
                { value: 'Wednesday', label: 'Wednesday' },
                { value: 'Thursday', label: 'Thursday' },
                { value: 'Friday', label: 'Friday' },
                { value: 'Saturday', label: 'Saturday' },
              ]}
            />
            <Input
              label="Section"
              placeholder="e.g. A"
              required
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Code"
              placeholder="e.g. CS301"
              required
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            />
            <Input
              label="Course Name"
              placeholder="e.g. Cloud Architecture"
              required
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              placeholder="e.g. 09:00 AM"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              placeholder="e.g. 10:00 AM"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Faculty Professor"
              placeholder="e.g. Dr. Alan Turing"
              required
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
            />
            <Input
              label="Lecture Room"
              placeholder="e.g. Hall 304"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Schedule Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

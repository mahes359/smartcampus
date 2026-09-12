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
import { leaveService } from '../../services/leaveService';
import type { LeaveApplication, ServiceStatus } from '../../types';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';

export const LeavePage: React.FC = () => {
  const { user, activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'MEDICAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, leavesRes] = await Promise.all([
        leaveService.getStatus().catch(() => null),
        leaveService.getLeaves(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setApplications(leavesRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await leaveService.applyLeave({
        ...formData,
        collegeId: activeCollegeId,
        applicantId: Number(user?.id) || 1,
        applicantName: user?.name || 'Applicant',
        applicantType: user?.role === 'FACULTY' ? 'FACULTY' : 'STUDENT',
        status: 'PENDING',
      });
      setIsModalOpen(false);
      setFormData({
        leaveType: 'MEDICAL',
        startDate: '',
        endDate: '',
        reason: '',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await leaveService.updateStatus(id, newStatus);
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this leave application?')) {
      await leaveService.deleteLeave(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Leave Applications & Approval Workflow"
        description="Faculty and student absence requests, medical leave validation & supervisory endorsements"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                leave-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Apply for Leave
            </Button>
          </div>
        }
      />

      <Card header="Leave History & Approvals">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            title="No leave applications found"
            description="Submit a new absence request by clicking 'Apply for Leave'."
            action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Apply Now</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {applications.map((app) => (
              <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{app.leaveType} Leave</h4>
                    <Badge variant={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Applicant: <strong>{app.applicantName}</strong> ({app.applicantType}) • {app.startDate} to {app.endDate}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reason: {app.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  {app.status === 'PENDING' && (
                    <>
                      <Button size="sm" variant="success" onClick={() => handleUpdateStatus(app.id, 'APPROVED')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(app.id, 'REJECTED')}>
                        Reject
                      </Button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Leave Application">
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <Select
            label="Leave Type"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={[
              { value: 'MEDICAL', label: 'Medical / Health Leave' },
              { value: 'DUTY', label: 'On-Duty Conference / Sports' },
              { value: 'CASUAL', label: 'Casual / Personal Leave' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <Input
            label="Detailed Reason"
            placeholder="Explain the context of absence..."
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

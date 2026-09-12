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
import { helpdeskService } from '../../services/helpdeskService';
import type { SupportTicket, ServiceStatus } from '../../types';
import { CheckCircle2, Plus, Clock, Trash2 } from 'lucide-react';

export const HelpdeskPage: React.FC = () => {
  const { user, activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'IT & NETWORK',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    description: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, ticketsRes] = await Promise.all([
        helpdeskService.getStatus().catch(() => null),
        helpdeskService.getTickets(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setTickets(ticketsRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await helpdeskService.createTicket({
        ...formData,
        collegeId: activeCollegeId,
        requesterName: user?.name || 'Student / Staff',
      });
      setIsModalOpen(false);
      setFormData({
        subject: '',
        category: 'IT & NETWORK',
        priority: 'MEDIUM',
        description: '',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await helpdeskService.updateStatus(id, newStatus);
    await loadData();
  };

  const handleDeleteTicket = async (id: number) => {
    if (window.confirm('Delete this support ticket?')) {
      await helpdeskService.deleteTicket(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Campus Support & Grievance Helpdesk"
        description="Submit inquiry tickets, track resolution status & report IT/facilities incidents"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                helpdesk-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Raise Ticket
            </Button>
          </div>
        }
      />

      <Card header="Recent Support Inquiries">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No support tickets found"
            description="Raise a grievance or IT inquiry by clicking 'Raise Ticket'."
            action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Raise Ticket</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {tickets.map((t) => (
              <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{t.ticketNumber}</span>
                    <Badge variant={t.priority === 'URGENT' || t.priority === 'HIGH' ? 'danger' : 'neutral'} size="sm">
                      {t.priority}
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {t.category}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{t.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    By: <strong>{t.requesterName}</strong> • Created: {t.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={t.status === 'RESOLVED' ? 'success' : 'warning'} size="sm">
                    {t.status === 'RESOLVED' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {t.status}
                  </Badge>
                  {t.status !== 'RESOLVED' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(t.id, 'RESOLVED')}>
                      Resolve
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteTicket(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Ticket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Helpdesk Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Subject / Issue Summary"
            placeholder="Brief description of the problem..."
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'IT & NETWORK', label: 'IT, Software & Wi-Fi' },
                { value: 'FACILITIES', label: 'Hostel & Facilities' },
                { value: 'ACADEMIC', label: 'Academic & Courses' },
                { value: 'ACCOUNTS', label: 'Accounts & Tuition' },
              ]}
            />
            <Select
              label="Urgency"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' })}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High Priority' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
            />
          </div>
          <Input
            label="Detailed Description"
            placeholder="Provide complete incident specifics..."
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

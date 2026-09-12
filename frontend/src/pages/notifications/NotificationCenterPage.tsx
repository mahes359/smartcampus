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
import { notificationService } from '../../services/notificationService';
import type { NotificationItem, ServiceStatus } from '../../types';
import { Bell, CheckCircle2, AlertTriangle, BookOpen, Clock, Plus, Trash2 } from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT' as 'ANNOUNCEMENT' | 'EXAM' | 'FEE' | 'ATTENDANCE' | 'SYSTEM',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, notifRes] = await Promise.all([
        notificationService.getStatus().catch(() => null),
        notificationService.getNotifications(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setNotifications(notifRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await notificationService.createNotification({
        ...formData,
        collegeId: activeCollegeId,
        isRead: false,
        timestamp: 'Just now',
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        message: '',
        type: 'ANNOUNCEMENT',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    await loadData();
  };

  const handleDeleteNotification = async (id: number) => {
    if (window.confirm('Delete this notification?')) {
      await notificationService.deleteNotification(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Notification & Broadcast Center"
        description="Institutional broadcasts, critical attendance warnings, fee reminders & academic updates"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                notification-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Broadcast Notice
            </Button>
          </div>
        }
      />

      <Card header="Recent Alerts & Notices">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <LoadingSkeleton height="60px" />
            <LoadingSkeleton height="60px" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications or broadcasts"
            description="Publish an institutional notice by clicking 'Broadcast Notice'."
            action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Broadcast Notice</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 shrink-0">
                    {n.type === 'ATTENDANCE' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : n.type === 'EXAM' ? (
                      <BookOpen className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Bell className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={n.type === 'ATTENDANCE' ? 'warning' : 'primary'} size="sm">
                    {n.type}
                  </Badge>
                  {!n.isRead && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(n.id)}>
                      Mark Read
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Broadcast Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Institutional Announcement">
        <form onSubmit={handleCreateNotification} className="space-y-4">
          <Input
            label="Notice Title"
            placeholder="e.g. Campus Wi-Fi Scheduled Maintenance"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            label="Notice Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ANNOUNCEMENT' | 'EXAM' | 'FEE' | 'ATTENDANCE' | 'SYSTEM' })}
            options={[
              { value: 'ANNOUNCEMENT', label: 'General Announcement' },
              { value: 'EXAM', label: 'Examination Alert' },
              { value: 'FEE', label: 'Fee Reminder' },
              { value: 'ATTENDANCE', label: 'Attendance Warning' },
              { value: 'SYSTEM', label: 'System Notice' },
            ]}
          />
          <Input
            label="Detailed Message"
            placeholder="Write the complete announcement content..."
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

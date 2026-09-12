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
import { eventService } from '../../services/eventService';
import type { CampusEvent, ServiceStatus } from '../../types';
import { CalendarDays, CheckCircle2, MapPin, Users, Plus, Trash2 } from 'lucide-react';

export const EventPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    eventType: 'TECH',
    eventDate: '',
    venue: '',
    organizer: '',
    description: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, eventsRes] = await Promise.all([
        eventService.getStatus().catch(() => null),
        eventService.getEvents(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setEvents(eventsRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await eventService.createEvent({
        ...formData,
        collegeId: activeCollegeId,
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        eventType: 'TECH',
        eventDate: '',
        venue: '',
        organizer: '',
        description: '',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Delete this campus event?')) {
      await eventService.deleteEvent(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Campus Events, Hackathons & Cultural Fests"
        description="University activities, technical symposiums, athletic meets & attendee registration"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                event-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Create Event
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton height="180px" />
          <LoadingSkeleton height="180px" />
          <LoadingSkeleton height="180px" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No upcoming events scheduled"
          description="Click 'Create Event' to announce a new symposium, festival, or sports championship."
          action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Announce Event</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card
              key={ev.id}
              header={
                <div className="flex items-center justify-between w-full">
                  <Badge variant="primary" size="sm">{ev.eventType}</Badge>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            >
              <div className="text-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{ev.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{ev.description}</p>
                <div className="space-y-1.5 text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                    {ev.eventDate}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {ev.venue}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    {ev.organizer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Announce Campus Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Annual Cloud Summit 2024"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Event Type"
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              options={[
                { value: 'TECH', label: 'Technical Symposium / Hackathon' },
                { value: 'ACADEMIC', label: 'Academic Conference' },
                { value: 'SPORTS', label: 'Athletic Meet / Tournament' },
                { value: 'CULTURAL', label: 'Cultural Fest' },
              ]}
            />
            <Input
              label="Event Date"
              type="date"
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Venue"
              placeholder="e.g. Auditorium Hall B"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
            <Input
              label="Organizer"
              placeholder="e.g. School of Computer Science"
              required
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            />
          </div>
          <Input
            label="Description"
            placeholder="Overview of keynote speakers, schedule and tracks..."
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

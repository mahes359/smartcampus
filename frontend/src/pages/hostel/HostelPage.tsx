import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { hostelService } from '../../services/hostelService';
import type { HostelRoom, ServiceStatus } from '../../types';
import { CheckCircle2, Bed, Users, Plus, Trash2 } from 'lucide-react';

export const HostelPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    blockName: 'Block A (Nelson Mandela Hall)',
    roomNumber: '',
    capacity: 2,
    occupied: 0,
    monthlyFee: 250.0,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, roomsRes] = await Promise.all([
        hostelService.getStatus().catch(() => null),
        hostelService.getRooms(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setRooms(roomsRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await hostelService.createRoom({
        ...formData,
        collegeId: activeCollegeId,
        capacity: Number(formData.capacity),
        occupied: Number(formData.occupied),
        monthlyFee: Number(formData.monthlyFee),
      });
      setIsModalOpen(false);
      setFormData({
        blockName: 'Block A (Nelson Mandela Hall)',
        roomNumber: '',
        capacity: 2,
        occupied: 0,
        monthlyFee: 250.0,
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm('Delete this hostel room record?')) {
      await hostelService.deleteRoom(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Hostel & Residential Life Management"
        description="Dormitory block oversight, room assignments, bed availability & warden administration"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                hostel-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Add Room
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingSkeleton height="150px" />
          <LoadingSkeleton height="150px" />
          <LoadingSkeleton height="150px" />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState
          title="No hostel rooms configured"
          description="Click 'Add Room' to allocate a dormitory room in the backend database."
          action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Add Room</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((r) => {
            const isFull = r.occupied >= r.capacity;
            const occupancyRate = Math.round(((r.occupied || 0) / (r.capacity || 1)) * 100);
            return (
              <Card
                key={r.id}
                header={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{r.roomNumber}</span>
                    <button
                      onClick={() => handleDeleteRoom(r.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                }
              >
                <div className="text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{r.blockName}</span>
                    <Badge variant={isFull ? 'danger' : 'success'} size="sm">
                      {occupancyRate}% Full
                    </Badge>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-blue-500" />
                      {r.capacity} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-500" />
                      {r.occupied} Occupied
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Monthly Accommodation:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${r.monthlyFee}/mo</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Hostel Room Allocation">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <Input
            label="Block / Residence Name"
            placeholder="e.g. Block A (Mandela Hall)"
            required
            value={formData.blockName}
            onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Room Number"
              placeholder="e.g. A-204"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
            <Input
              label="Monthly Fee ($)"
              type="number"
              required
              value={formData.monthlyFee}
              onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Bed Capacity"
              type="number"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
            <Input
              label="Currently Occupied Beds"
              type="number"
              value={formData.occupied}
              onChange={(e) => setFormData({ ...formData, occupied: Number(e.target.value) })}
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

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
import { transportService } from '../../services/transportService';
import type { TransportRoute, ServiceStatus } from '../../types';
import { Bus, CheckCircle2, MapPin, User, Plus, Trash2 } from 'lucide-react';

export const TransportPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    routeCode: '',
    routeName: '',
    busNumber: '',
    driverName: '',
    driverPhone: '',
    totalStops: 10,
    annualFee: 350.0,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, routesRes] = await Promise.all([
        transportService.getStatus().catch(() => null),
        transportService.getRoutes(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setRoutes(routesRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await transportService.createRoute({
        ...formData,
        collegeId: activeCollegeId,
        totalStops: Number(formData.totalStops),
        annualFee: Number(formData.annualFee),
      });
      setIsModalOpen(false);
      setFormData({
        routeCode: '',
        routeName: '',
        busNumber: '',
        driverName: '',
        driverPhone: '',
        totalStops: 10,
        annualFee: 350.0,
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transport route?')) {
      await transportService.deleteRoute(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Campus Transport & Fleet Management"
        description="Daily bus transit routes, pickup stations, fleet vehicle maintenance & student transit passes"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                transport-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Add Route
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingSkeleton height="160px" />
          <LoadingSkeleton height="160px" />
          <LoadingSkeleton height="160px" />
        </div>
      ) : routes.length === 0 ? (
        <EmptyState
          title="No transport routes configured"
          description="Click 'Add Route' to register the first bus transit route in the backend database."
          action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Create Route</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((r) => (
            <Card
              key={r.id}
              header={
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{r.routeCode}</span>
                  <button
                    onClick={() => handleDeleteRoute(r.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Route"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            >
              <div className="text-xs space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{r.routeName}</h4>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-blue-500" />
                    {r.busNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {r.totalStops} Stops
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {r.driverName}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ${r.annualFee}/yr
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Phone: {r.driverPhone}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Route Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transport Transit Route">
        <form onSubmit={handleCreateRoute} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Route Code"
              placeholder="e.g. ROUTE-04"
              required
              value={formData.routeCode}
              onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
            />
            <Input
              label="Bus Number"
              placeholder="e.g. BUS-115"
              required
              value={formData.busNumber}
              onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
            />
          </div>

          <Input
            label="Route Name"
            placeholder="e.g. Westside Express Shuttle"
            required
            value={formData.routeName}
            onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Driver Name"
              placeholder="e.g. Robert Clark"
              required
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            />
            <Input
              label="Driver Phone"
              placeholder="e.g. +1 555-0329"
              required
              value={formData.driverPhone}
              onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Stops"
              type="number"
              required
              value={formData.totalStops}
              onChange={(e) => setFormData({ ...formData, totalStops: Number(e.target.value) })}
            />
            <Input
              label="Annual Transit Fee ($)"
              type="number"
              required
              value={formData.annualFee}
              onChange={(e) => setFormData({ ...formData, annualFee: Number(e.target.value) })}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save Route
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

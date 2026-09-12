import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { placementService } from '../../services/placementService';
import type { PlacementDrive, ServiceStatus } from '../../types';
import { Briefcase, CheckCircle2, DollarSign, Users, Plus, Trash2 } from 'lucide-react';

export const PlacementPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    roleTitle: '',
    packageLPA: 20.0,
    eligibilityCriteria: 'CGPA >= 7.5, 0 Backlogs',
    driveDate: '',
    totalOpenings: 10,
    status: 'UPCOMING' as 'UPCOMING' | 'ACTIVE' | 'COMPLETED',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, drivesRes] = await Promise.all([
        placementService.getStatus().catch(() => null),
        placementService.getDrives(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setDrives(drivesRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  // Derived Dynamic Statistics
  const avgPackage = drives.length > 0
    ? (drives.reduce((acc, d) => acc + (d.packageLPA || 0), 0) / drives.length).toFixed(1)
    : '0';
  const totalOpenings = drives.reduce((acc, d) => acc + (d.totalOpenings || 0), 0);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await placementService.createDrive({
        ...formData,
        collegeId: activeCollegeId,
        packageLPA: Number(formData.packageLPA),
        totalOpenings: Number(formData.totalOpenings),
      });
      setIsModalOpen(false);
      setFormData({
        companyName: '',
        roleTitle: '',
        packageLPA: 20.0,
        eligibilityCriteria: 'CGPA >= 7.5, 0 Backlogs',
        driveDate: '',
        totalOpenings: 10,
        status: 'UPCOMING',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDrive = async (id: number) => {
    if (window.confirm('Delete this recruitment drive?')) {
      await placementService.deleteDrive(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Career Placements & Corporate Recruitment"
        description="Campus hiring drives, enterprise interviews, job offers & salary package statistics"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                placement-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Post Drive
            </Button>
          </div>
        }
      />

      {/* Dynamic Placement KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Average CTC Package"
          value={isLoading ? '...' : `$${avgPackage}k / yr`}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          subtitle="Computed across active corporate drives"
        />
        <StatCard
          title="Total Vacancies"
          value={isLoading ? '...' : totalOpenings}
          icon={<Users className="w-5 h-5" />}
          subtitle="Combined openings across registered drives"
        />
        <StatCard
          title="Active Recruitment Drives"
          value={isLoading ? '...' : drives.length}
          icon={<Briefcase className="w-5 h-5" />}
          subtitle="Tier-1 Enterprise & Cloud partners"
        />
      </div>

      <Card header="Active & Upcoming Campus Recruitment Drives">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <LoadingSkeleton height="60px" />
            <LoadingSkeleton height="60px" />
          </div>
        ) : drives.length === 0 ? (
          <EmptyState
            title="No recruitment drives scheduled"
            description="Post a recruitment drive for graduating students by clicking 'Post Drive'."
            action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Post Drive</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {drives.map((d) => (
              <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{d.companyName}</h4>
                    <Badge variant="primary" size="sm">${d.packageLPA}k CTC</Badge>
                    <Badge variant={d.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
                      {d.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{d.roleTitle}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Drive Date: {d.driveDate} • {d.totalOpenings} Openings • Criteria: {d.eligibilityCriteria}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    Register
                  </Button>
                  <button
                    onClick={() => handleDeleteDrive(d.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Drive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Post Drive Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post Corporate Recruitment Drive">
        <form onSubmit={handleCreateDrive} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company Name"
              placeholder="e.g. Google Cloud"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <Input
              label="Role Title"
              placeholder="e.g. Cloud Systems Engineer"
              required
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CTC Package ($k / yr)"
              type="number"
              required
              value={formData.packageLPA}
              onChange={(e) => setFormData({ ...formData, packageLPA: Number(e.target.value) })}
            />
            <Input
              label="Total Openings"
              type="number"
              required
              value={formData.totalOpenings}
              onChange={(e) => setFormData({ ...formData, totalOpenings: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Drive Date"
              type="date"
              required
              value={formData.driveDate}
              onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
            />
            <Select
              label="Drive Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'UPCOMING' | 'ACTIVE' | 'COMPLETED' })}
              options={[
                { value: 'UPCOMING', label: 'Upcoming' },
                { value: 'ACTIVE', label: 'Active (Open for applications)' },
                { value: 'COMPLETED', label: 'Completed' },
              ]}
            />
          </div>

          <Input
            label="Eligibility Criteria"
            placeholder="e.g. CGPA >= 7.5, 0 Backlogs"
            required
            value={formData.eligibilityCriteria}
            onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Post Drive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

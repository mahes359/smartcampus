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
import { feeService } from '../../services/feeService';
import type { FeeRecord, ServiceStatus } from '../../types';
import { Banknote, CheckCircle2, Clock, AlertTriangle, Plus, Trash2, CreditCard } from 'lucide-react';

export const FeeManagementPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: 1,
    studentName: 'Alex Mercer',
    feeType: 'Tuition Fee - Semester VI',
    totalAmount: 4000.0,
    paidAmount: 0.0,
    dueDate: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, feesRes] = await Promise.all([
        feeService.getStatus().catch(() => null),
        feeService.getFees(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setFees(feesRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  // Derived Dynamic Statistics
  const totalBilled = fees.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
  const clearedPayments = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const outstandingBalance = Math.max(0, totalBilled - clearedPayments);

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await feeService.createFee({
        ...formData,
        collegeId: activeCollegeId,
        studentId: Number(formData.studentId),
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount),
        status: Number(formData.paidAmount) >= Number(formData.totalAmount) ? 'PAID' : 'PENDING',
      });
      setIsModalOpen(false);
      setFormData({
        studentId: 1,
        studentName: 'Alex Mercer',
        feeType: 'Tuition Fee - Semester VI',
        totalAmount: 4000.0,
        paidAmount: 0.0,
        dueDate: '',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (id: number) => {
    await feeService.recordPayment(id);
    await loadData();
  };

  const handleDeleteFee = async (id: number) => {
    if (window.confirm('Delete this fee record?')) {
      await feeService.deleteFee(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Student Fees, Invoices & Ledger"
        description="Tuition schedules, automated invoice tracking, scholarship credits & financial accounting"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                fee-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Create Invoice
            </Button>
          </div>
        }
      />

      {/* Dynamic KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Billed"
          value={isLoading ? '...' : `$${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<Banknote className="w-5 h-5" />}
          subtitle="Cumulative ledger billed"
        />
        <StatCard
          title="Cleared Payments"
          value={isLoading ? '...' : `$${clearedPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          subtitle="Settled and verified in backend"
        />
        <StatCard
          title="Outstanding Balance"
          value={isLoading ? '...' : `$${outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          trend={{ value: `${fees.filter((f) => f.status !== 'PAID').length} pending`, isPositive: outstandingBalance === 0 }}
          subtitle="Pending collection"
        />
      </div>

      <Card header="Institutional Fee Ledger & Invoices">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
          </div>
        ) : fees.length === 0 ? (
          <EmptyState
            title="No fee records recorded"
            description="Generate a student invoice or tuition fee structure by clicking 'Create Invoice'."
            action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Create Invoice</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {fees.map((f) => (
              <div key={f.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{f.feeType}</p>
                  <p className="text-[11px] text-slate-400">
                    Student: <strong>{f.studentName || `Student #${f.studentId}`}</strong> • Due Date: {f.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    ${f.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <Badge variant={f.status === 'PAID' ? 'success' : f.status === 'PARTIAL' ? 'info' : 'warning'} size="sm">
                    {f.status === 'PAID' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {f.status}
                  </Badge>
                  {f.status !== 'PAID' && (
                    <Button size="sm" variant="outline" leftIcon={<CreditCard className="w-3.5 h-3.5" />} onClick={() => handlePayment(f.id)}>
                      Pay Now
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteFee(f.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Invoice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Invoice Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Student Fee Invoice">
        <form onSubmit={handleCreateFee} className="space-y-4">
          <Input
            label="Student Name / Roll"
            required
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Fee Category"
              value={formData.feeType}
              onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
              options={[
                { value: 'B.Tech Tuition Fee - Semester VI', label: 'Tuition Fee' },
                { value: 'Campus Technology & Lab Infrastructure', label: 'Lab & Tech Infrastructure' },
                { value: 'University Library & Online Databases', label: 'Library & Access Fee' },
                { value: 'End-Term Examination Fee', label: 'Examination Fee' },
                { value: 'Hostel Accommodation Fee', label: 'Hostel & Mess Fee' },
              ]}
            />
            <Input
              label="Total Amount ($)"
              type="number"
              required
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Initial Paid Amount ($)"
              type="number"
              value={formData.paidAmount}
              onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
            />
            <Input
              label="Due Date"
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Generate Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

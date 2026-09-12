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
import { documentService } from '../../services/documentService';
import type { DocumentItem, ServiceStatus } from '../../types';
import { FileText, CheckCircle2, Upload, Clock, Trash2, Check, X } from 'lucide-react';

export const DocumentVaultPage: React.FC = () => {
  const { user, activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    documentType: 'TRANSCRIPT',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, docsRes] = await Promise.all([
        documentService.getStatus().catch(() => null),
        documentService.getDocuments(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setDocuments(docsRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await documentService.uploadDocument({
        ...formData,
        collegeId: activeCollegeId,
        studentId: Number(user?.id) || 1,
        status: 'PENDING',
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        documentType: 'TRANSCRIPT',
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: number, verifyStatus: string) => {
    await documentService.verifyDocument(id, verifyStatus);
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this archived credential?')) {
      await documentService.deleteDocument(id);
      await loadData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Digital Credentials & Document Vault"
        description="Encrypted certificate repository, institutional verification workflows & identity proof archives"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                document-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Upload className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Upload Document
            </Button>
          </div>
        }
      />

      <Card header="Archived Credentials & Verification Status">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            title="No credentials or documents archived"
            description="Upload academic transcripts, certificates, or identity proofs by clicking 'Upload Document'."
            action={<Button size="sm" onClick={() => setIsModalOpen(true)}>Upload Now</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {documents.map((d) => (
              <div key={d.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{d.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Category: {d.documentType} • Uploaded: {d.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.status === 'VERIFIED' ? 'success' : d.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                    {d.status === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {d.status}
                  </Badge>
                  {d.status === 'PENDING' && (
                    <>
                      <Button size="sm" variant="success" leftIcon={<Check className="w-3 h-3" />} onClick={() => handleVerify(d.id, 'VERIFIED')}>
                        Verify
                      </Button>
                      <Button size="sm" variant="danger" leftIcon={<X className="w-3 h-3" />} onClick={() => handleVerify(d.id, 'REJECTED')}>
                        Reject
                      </Button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upload Document Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Digital Credential">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. High School Leaving Certificate"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            label="Credential Category"
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            options={[
              { value: 'TRANSCRIPT', label: 'Academic Transcript' },
              { value: 'CERTIFICATE', label: 'Degree / Leaving Certificate' },
              { value: 'ID_PROOF', label: 'Government ID / Passport' },
              { value: 'MEDICAL', label: 'Medical Fitness Certificate' },
            ]}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Archive Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

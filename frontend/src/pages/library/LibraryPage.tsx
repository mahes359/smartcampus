import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { libraryService } from '../../services/libraryService';
import type { LibraryBook, ServiceStatus } from '../../types';
import { CheckCircle2, Search, Book, Plus, Trash2 } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { activeCollegeId } = useAuth();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    category: 'COMPUTER_SCIENCE',
    totalCopies: 10,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, booksRes] = await Promise.all([
        libraryService.getStatus().catch(() => null),
        libraryService.getBooks(activeCollegeId).catch(() => []),
      ]);
      setStatus(statusRes);
      setBooks(booksRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollegeId]);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await libraryService.createBook({
        ...formData,
        collegeId: activeCollegeId,
        totalCopies: Number(formData.totalCopies),
        availableCopies: Number(formData.totalCopies),
      });
      setIsModalOpen(false);
      setFormData({
        isbn: '',
        title: '',
        author: '',
        category: 'COMPUTER_SCIENCE',
        totalCopies: 10,
      });
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (window.confirm('Delete this book from the catalog?')) {
      await libraryService.deleteBook(id);
      await loadData();
    }
  };

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Campus Library & Knowledge Catalog"
        description="Book repository, digital textbook issues, reservations & circulation management"
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                library-service: {status.status}
              </Badge>
            )}
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Add Book
            </Button>
          </div>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Search catalog by book title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="120px" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No library books found"
          description={books.length === 0 ? "Add your first book to the catalog by clicking 'Add Book'." : "No books match your search filter."}
          action={books.length === 0 ? <Button size="sm" onClick={() => setIsModalOpen(true)}>Add Book</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <Card key={b.id}>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl shrink-0">
                  <Book className="w-6 h-6" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral" size="sm">{b.category}</Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        {b.availableCopies} / {b.totalCopies} Available
                      </Badge>
                      <button
                        onClick={() => handleDeleteBook(b.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-1">{b.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Author: {b.author}</p>
                  <p className="text-[11px] text-slate-400 mt-1">ISBN: {b.isbn}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Book in Library Catalog">
        <form onSubmit={handleCreateBook} className="space-y-4">
          <Input
            label="Book Title"
            placeholder="e.g. Clean Architecture"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Author(s)"
              placeholder="e.g. Robert C. Martin"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <Input
              label="ISBN"
              placeholder="e.g. 978-0134494166"
              required
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
                { value: 'DISTRIBUTED_SYSTEMS', label: 'Distributed Systems & Cloud' },
                { value: 'ELECTRONICS', label: 'Electronics & Hardware' },
                { value: 'MATHEMATICS', label: 'Mathematics & Data' },
                { value: 'GENERAL', label: 'General Knowledge' },
              ]}
            />
            <Input
              label="Total Copies"
              type="number"
              required
              value={formData.totalCopies}
              onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save Book
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

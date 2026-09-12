import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { collegeService } from '../../services/collegeService';
import type { College, Department, Program } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Building2, Plus, Layers, BookOpen, Search } from 'lucide-react';

export const CollegeListPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);

  // Form states
  const [newCollegeCode, setNewCollegeCode] = useState('');
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeDomain, setNewCollegeDomain] = useState('');

  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');

  const [newProgCode, setNewProgCode] = useState('');
  const [newProgName, setNewProgName] = useState('');
  const [newProgDuration, setNewProgDuration] = useState(4);

  const selectCollege = (college: College) => {
    setSelectedCollege(college);
    collegeService.getDepartments(college.id)
      .then((data) => setDepartments(data || []))
      .catch(() => setDepartments([]));
    collegeService.getPrograms(college.id)
      .then((data) => setPrograms(data || []))
      .catch(() => setPrograms([]));
  };

  const loadColleges = () => {
    setIsLoading(true);
    collegeService.getAllColleges()
      .then((data) => {
        setColleges(data || []);
        if (data && data.length > 0 && !selectedCollege) {
          selectCollege(data[0]);
        }
      })
      .catch(() => setColleges([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeCode || !newCollegeName) return;

    try {
      const created = await collegeService.createCollege({
        code: newCollegeCode.toUpperCase(),
        name: newCollegeName,
        domain: newCollegeDomain,
        status: 'ACTIVE',
      });
      setIsCollegeModalOpen(false);
      setNewCollegeCode('');
      setNewCollegeName('');
      setNewCollegeDomain('');
      loadColleges();
      selectCollege(created);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create college');
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollege || !newDeptCode || !newDeptName) return;

    try {
      await collegeService.createDepartment(selectedCollege.id, {
        code: newDeptCode.toUpperCase(),
        name: newDeptName,
      });
      setIsDeptModalOpen(false);
      setNewDeptCode('');
      setNewDeptName('');
      selectCollege(selectedCollege);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create department');
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollege || !newProgCode || !newProgName) return;

    try {
      await collegeService.createProgram(selectedCollege.id, {
        code: newProgCode.toUpperCase(),
        name: newProgName,
        departmentId: departments[0]?.id || 1,
        durationYears: newProgDuration,
      });
      setIsProgModalOpen(false);
      setNewProgCode('');
      setNewProgName('');
      selectCollege(selectedCollege);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create program');
    }
  };

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="College Hierarchy & Multi-Tenant Registry"
        description="Manage institutions, departments, degree programs, semesters, and class sections across tenant databases"
        actions={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCollegeModalOpen(true)}>
            Register Institution
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Colleges List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="mb-4">
            <Input
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredColleges.map((c) => {
              const isSelected = selectedCollege?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => selectCollege(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">{c.name}</h4>
                    <Badge variant={c.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
                      {c.code}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Domain: {c.domain || 'campus.edu'}</p>
                </div>
              );
            })}
            {!isLoading && filteredColleges.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No colleges found.</p>
            )}
          </div>
        </div>

        {/* Right Column: Organization Structure of Selected College */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCollege ? (
            <>
              {/* College Overview Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 text-white rounded-xl">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedCollege.name}</h2>
                      <p className="text-xs text-slate-500">Institution Code: {selectedCollege.code} • ID: {selectedCollege.id}</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="md">
                    Tenant Isolated
                  </Badge>
                </div>
              </div>

              {/* Departments Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Academic Departments</h3>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsDeptModalOpen(true)}>
                    Add Department
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {departments.map((d) => (
                    <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-lg text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span>{d.name}</span>
                        <Badge variant="neutral" size="sm">{d.code}</Badge>
                      </div>
                    </div>
                  ))}
                  {departments.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 col-span-2 text-center">No departments created yet.</p>
                  )}
                </div>
              </div>

              {/* Programs Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Degree Programs & Majors</h3>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsProgModalOpen(true)}>
                    Add Program
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {programs.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-lg text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span>{p.name}</span>
                        <Badge variant="primary" size="sm">{p.code}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Duration: {p.durationYears || 4} Years</p>
                    </div>
                  ))}
                  {programs.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 col-span-2 text-center">No degree programs configured yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Select an institution from the left list to view and manage hierarchy.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create College */}
      <Modal isOpen={isCollegeModalOpen} onClose={() => setIsCollegeModalOpen(false)} title="Register New Institution">
        <form onSubmit={handleCreateCollege} className="space-y-4">
          <Input label="College Code" placeholder="e.g. MIT, STAN" value={newCollegeCode} onChange={(e) => setNewCollegeCode(e.target.value)} required />
          <Input label="Institution Name" placeholder="e.g. Metropolitan Institute of Technology" value={newCollegeName} onChange={(e) => setNewCollegeName(e.target.value)} required />
          <Input label="Campus Domain" placeholder="e.g. mit.edu" value={newCollegeDomain} onChange={(e) => setNewCollegeDomain(e.target.value)} />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCollegeModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Register Institution</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Department */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title={`Add Department to ${selectedCollege?.code}`}>
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <Input label="Department Code" placeholder="e.g. CSE, ECE" value={newDeptCode} onChange={(e) => setNewDeptCode(e.target.value)} required />
          <Input label="Department Name" placeholder="e.g. Computer Science & Engineering" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} required />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDeptModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save Department</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Program */}
      <Modal isOpen={isProgModalOpen} onClose={() => setIsProgModalOpen(false)} title={`Add Degree Program to ${selectedCollege?.code}`}>
        <form onSubmit={handleCreateProgram} className="space-y-4">
          <Input label="Program Code" placeholder="e.g. BTECH-CS, MBA" value={newProgCode} onChange={(e) => setNewProgCode(e.target.value)} required />
          <Input label="Program Name" placeholder="e.g. Bachelor of Technology in Computer Science" value={newProgName} onChange={(e) => setNewProgName(e.target.value)} required />
          <Input label="Duration (Years)" type="number" min={1} max={6} value={newProgDuration} onChange={(e) => setNewProgDuration(parseInt(e.target.value, 10))} required />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsProgModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save Program</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

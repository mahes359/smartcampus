import { api } from './api';
import type {
  College,
  Department,
  Program,
  AcademicYear,
  Semester,
  Section,
  ServiceStatus,
} from '../types';

export const collegeService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/colleges/status');
    return res.data;
  },

  async getAllColleges(): Promise<College[]> {
    const res = await api.get('/api/colleges');
    return res.data;
  },

  async getCollegeById(id: number): Promise<College> {
    const res = await api.get(`/api/colleges/${id}`);
    return res.data;
  },

  async createCollege(data: Partial<College>): Promise<College> {
    const res = await api.post('/api/colleges', data);
    return res.data;
  },

  // Departments
  async getDepartments(collegeId: number): Promise<Department[]> {
    const res = await api.get(`/api/colleges/${collegeId}/departments`);
    return res.data;
  },

  async createDepartment(collegeId: number, data: Partial<Department>): Promise<Department> {
    const res = await api.post(`/api/colleges/${collegeId}/departments`, data);
    return res.data;
  },

  // Programs
  async getPrograms(collegeId: number): Promise<Program[]> {
    const res = await api.get(`/api/colleges/${collegeId}/programs`);
    return res.data;
  },

  async createProgram(collegeId: number, data: Partial<Program>): Promise<Program> {
    const res = await api.post(`/api/colleges/${collegeId}/programs`, data);
    return res.data;
  },

  // Academic Years
  async getAcademicYears(collegeId: number): Promise<AcademicYear[]> {
    const res = await api.get(`/api/colleges/${collegeId}/academic-years`);
    return res.data;
  },

  async createAcademicYear(collegeId: number, data: Partial<AcademicYear>): Promise<AcademicYear> {
    const res = await api.post(`/api/colleges/${collegeId}/academic-years`, data);
    return res.data;
  },

  // Semesters
  async getSemesters(collegeId: number): Promise<Semester[]> {
    const res = await api.get(`/api/colleges/${collegeId}/semesters`);
    return res.data;
  },

  async createSemester(collegeId: number, data: Partial<Semester>): Promise<Semester> {
    const res = await api.post(`/api/colleges/${collegeId}/semesters`, data);
    return res.data;
  },

  // Sections
  async getSections(collegeId: number): Promise<Section[]> {
    const res = await api.get(`/api/colleges/${collegeId}/sections`);
    return res.data;
  },

  async createSection(collegeId: number, data: Partial<Section>): Promise<Section> {
    const res = await api.post(`/api/colleges/${collegeId}/sections`, data);
    return res.data;
  },
};

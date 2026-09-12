import { api } from './api';
import type { ServiceStatus } from '../types';

export interface CampusReportSummary {
  collegeId: number;
  totalLearners: number;
  activeFaculty: number;
  averageAttendancePercentage: number;
  annualTuitionCollected: number;
  activePlacementDrives: number;
  openTickets: number;
  libraryBookCirculation: number;
}

export const reportService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/reports/status');
    return res.data;
  },

  async getSummary(collegeId?: number): Promise<CampusReportSummary> {
    const res = await api.get('/api/reports/summary', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data;
  },
};

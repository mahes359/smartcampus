import type { UserRole } from '../constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId?: number;
  departmentId?: number;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ServiceStatus {
  service: string;
  status: 'UP' | 'DOWN' | 'MAINTENANCE';
  message: string;
  timestamp?: string;
}

// --- Multi-Tenant Master Hierarchy (college-service) ---
export interface College {
  id: number;
  code: string;
  name: string;
  domain?: string;
  address?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: number;
  collegeId: number;
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Program {
  id: number;
  collegeId: number;
  departmentId: number;
  code: string;
  name: string;
  durationYears?: number;
  degreeType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicYear {
  id: number;
  collegeId: number;
  yearCode: string;
  startDate?: string;
  endDate?: string;
  currentYear?: boolean;
}

export interface Semester {
  id: number;
  collegeId: number;
  academicYearId: number;
  semesterNumber: number;
  semesterName?: string;
  startDate?: string;
  endDate?: string;
}

export interface Section {
  id: number;
  collegeId: number;
  semesterId: number;
  sectionName: string;
  capacity?: number;
}

// --- Student (student-service) ---
export interface Student {
  id: number;
  collegeId: number;
  departmentId?: number;
  studentNumber: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bloodGroup?: string;
  parentGuardianInfo?: string;
  emergencyContact?: string;
  department?: string;
  program?: string;
  year?: number;
  semester?: number;
  section?: string;
  admissionDate?: string;
  studentStatus?: string;
  profileInformation?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Faculty (faculty-service) ---
export interface Faculty {
  id: number;
  collegeId: number;
  departmentId?: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  facultyStatus?: string;
  officeRoom?: string;
  facultyRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Course (course-service) ---
export interface Course {
  id: number;
  collegeId: number;
  departmentId?: number;
  courseCode: string;
  courseName: string;
  description?: string;
  department?: string;
  program?: string;
  credits: number;
  semester: number;
  academicYear?: string;
  theoryPractical?: string;
  courseType?: string;
  capacity?: number;
  prerequisites?: string;
  assignedFaculty?: string;
  courseStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Enrollment (enrollment-service) ---
export interface Enrollment {
  id: number;
  collegeId: number;
  enrollmentCode: string;
  studentId: number;
  courseId: number;
  semester: number;
  status: string;
  enrollmentDate?: string;
  academicYear?: string;
  enrollmentType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Attendance (attendance-service) ---
export interface Attendance {
  id: number;
  collegeId: number;
  attendanceCode: string;
  studentId: number;
  courseId: number;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | string;
  semester?: number;
  academicYear?: string;
  attendanceType?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Exam (exam-service) ---
export interface Exam {
  id: number;
  collegeId: number;
  examCode: string;
  courseId: number;
  examType: string;
  examDate: string;
  semester: number;
  academicYear?: string;
  totalMarks: number;
  passingMarks?: number;
  location?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Timetable (timetable-service) ---
export interface TimetableSlot {
  id: number;
  collegeId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  roomNumber: string;
  section: string;
}

// --- Fee (fee-service) ---
export interface FeeRecord {
  id: number;
  collegeId: number;
  studentId: number;
  studentName?: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
}

// --- Library (library-service) ---
export interface LibraryBook {
  id: number;
  collegeId: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
}

export interface BookIssue {
  id: number;
  bookId: number;
  bookTitle: string;
  studentId: number;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount?: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

// --- Hostel (hostel-service) ---
export interface HostelRoom {
  id: number;
  collegeId: number;
  blockName: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  monthlyFee: number;
}

// --- Transport (transport-service) ---
export interface TransportRoute {
  id: number;
  collegeId: number;
  routeCode: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  totalStops: number;
  annualFee: number;
}

// --- Leave (leave-service) ---
export interface LeaveApplication {
  id: number;
  collegeId: number;
  applicantId: number;
  applicantName: string;
  applicantType: 'STUDENT' | 'FACULTY';
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// --- Placement (placement-service) ---
export interface PlacementDrive {
  id: number;
  collegeId: number;
  companyName: string;
  roleTitle: string;
  packageLPA: number;
  eligibilityCriteria: string;
  driveDate: string;
  totalOpenings: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
}

// --- Events (event-service) ---
export interface CampusEvent {
  id: number;
  collegeId: number;
  title: string;
  eventType: string;
  eventDate: string;
  venue: string;
  organizer: string;
  description: string;
}

// --- Notifications (notification-service) ---
export interface NotificationItem {
  id: number;
  collegeId: number;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'EXAM' | 'FEE' | 'ATTENDANCE' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
}

// --- Documents (document-service) ---
export interface DocumentItem {
  id: number;
  collegeId: number;
  studentId: number;
  title: string;
  documentType: string;
  uploadDate: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

// --- Helpdesk (helpdesk-service) ---
export interface SupportTicket {
  id: number;
  collegeId: number;
  ticketNumber: string;
  requesterName: string;
  category: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

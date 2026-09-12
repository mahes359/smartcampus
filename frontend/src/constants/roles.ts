export type UserRole =
  | 'SUPER_ADMIN'
  | 'COLLEGE_ADMIN'
  | 'HOD'
  | 'FACULTY'
  | 'STUDENT'
  | 'PARENT'
  | 'EXAM_OFFICER'
  | 'ACCOUNTANT'
  | 'LIBRARIAN'
  | 'HOSTEL_WARDEN'
  | 'PLACEMENT_OFFICER'
  | 'TRANSPORT_MANAGER';

export const ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COLLEGE_ADMIN: 'COLLEGE_ADMIN',
  HOD: 'HOD',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  EXAM_OFFICER: 'EXAM_OFFICER',
  ACCOUNTANT: 'ACCOUNTANT',
  LIBRARIAN: 'LIBRARIAN',
  HOSTEL_WARDEN: 'HOSTEL_WARDEN',
  PLACEMENT_OFFICER: 'PLACEMENT_OFFICER',
  TRANSPORT_MANAGER: 'TRANSPORT_MANAGER',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Administrator',
  COLLEGE_ADMIN: 'College Administrator',
  HOD: 'Head of Department',
  FACULTY: 'Faculty Member',
  STUDENT: 'Student',
  PARENT: 'Parent / Guardian',
  EXAM_OFFICER: 'Examination Officer',
  ACCOUNTANT: 'Finance & Accounts',
  LIBRARIAN: 'Librarian',
  HOSTEL_WARDEN: 'Hostel Warden',
  PLACEMENT_OFFICER: 'Placement Officer',
  TRANSPORT_MANAGER: 'Transport Manager',
};

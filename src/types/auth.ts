export type UserRole = 'student' | 'lecturer';

export interface User {
  id: string;
  name: string;
  identifierNumber: string;
  email: string;
  role: UserRole;
  department: string;
  semester?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token?: string;
}

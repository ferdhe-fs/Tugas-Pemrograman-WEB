export type UserRole = 'mahasiswa' | 'dosen' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  identifierNumber: string; // NIM atau NIDN
  department: string;
  semester?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token?: string;
}

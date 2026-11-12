import { writable } from 'svelte/store';
import type { AuthState, User, UserRole } from '../types/auth';

const SESSION_STORAGE_KEY = 'sibermu_auth_session';
const USERS_REGISTRY_KEY = 'sibermu_users_registry';

export interface RegisteredAccount extends User {
  password: string;
}

// Data dummy sementara yang realistis untuk pengujian
export const INITIAL_DEMO_USERS: RegisteredAccount[] = [
  {
    id: 'usr-mhs-01',
    username: 'mahasiswa',
    password: 'password123',
    name: 'Ahmad Fauzan Syahputra',
    email: 'fauzan.mhs@sibermu.ac.id',
    role: 'mahasiswa',
    identifierNumber: '230101001',
    department: 'S1 Informatika',
    semester: 4,
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ahmad+Fauzan'
  },
  {
    id: 'usr-dsn-01',
    username: 'dosen',
    password: 'password123',
    name: 'Dr. Ir. Muhammad Arifin, M.Kom.',
    email: 'm.arifin@sibermu.ac.id',
    role: 'dosen',
    identifierNumber: '0612048501',
    department: 'S1 Informatika',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Muhammad+Arifin'
  }
];

function getStoredUsers(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Gagal membaca data pengguna dari localStorage:', err);
  }
  // Pasang data dummy sementara jika belum ada akun
  saveStoredUsers(INITIAL_DEMO_USERS);
  return INITIAL_DEMO_USERS;
}

function saveStoredUsers(users: RegisteredAccount[]): void {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Gagal menyimpan data pengguna ke localStorage:', err);
  }
}

function getInitialSession(): AuthState {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.currentUser) {
        return {
          isAuthenticated: true,
          currentUser: parsed.currentUser,
          token: parsed.token || `token-${Date.now()}`
        };
      }
    }
  } catch (err) {
    console.error('Gagal membaca sesi dari localStorage:', err);
  }
  return {
    isAuthenticated: false,
    currentUser: null
  };
}

function createAuthStore() {
  const { subscribe, set } = writable<AuthState>(getInitialSession());

  return {
    subscribe,

    // Registrasi akun baru
    register: (accountData: {
      username: string;
      password: string;
      name: string;
      email: string;
      role: UserRole;
      identifierNumber: string;
      department: string;
      semester?: number;
    }): { success: boolean; message: string; user?: User } => {
      const users = getStoredUsers();
      const trimmedUser = accountData.username.trim().toLowerCase();
      const trimmedEmail = accountData.email.trim().toLowerCase();
      const trimmedId = accountData.identifierNumber.trim();

      const exists = users.some(
        (u) =>
          u.username.toLowerCase() === trimmedUser ||
          u.email.toLowerCase() === trimmedEmail ||
          u.identifierNumber === trimmedId
      );

      if (exists) {
        return {
          success: false,
          message: 'Username, Email, atau NIM/NIDN sudah terdaftar.'
        };
      }

      const newUser: RegisteredAccount = {
        id: `usr-${Date.now()}`,
        username: accountData.username.trim(),
        password: accountData.password,
        name: accountData.name.trim(),
        email: accountData.email.trim(),
        role: accountData.role,
        identifierNumber: accountData.identifierNumber.trim(),
        department: accountData.department.trim(),
        semester: accountData.semester || 1,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(accountData.name.trim())}`
      };

      users.push(newUser);
      saveStoredUsers(users);

      const { password, ...userProfile } = newUser;
      const newState: AuthState = {
        isAuthenticated: true,
        currentUser: userProfile,
        token: `session-${Date.now()}`
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newState));
      set(newState);

      return {
        success: true,
        message: `Pendaftaran berhasil! Selamat datang, ${userProfile.name}.`,
        user: userProfile
      };
    },

    // Login
    login: (usernameInput: string, passwordInput: string): { success: boolean; message: string; user?: User } => {
      const users = getStoredUsers();
      const trimmedUser = usernameInput.trim().toLowerCase();

      const matched = users.find(
        (acc) =>
          (acc.username.toLowerCase() === trimmedUser ||
            acc.email.toLowerCase() === trimmedUser ||
            acc.identifierNumber.toLowerCase() === trimmedUser) &&
          acc.password === passwordInput
      );

      if (matched) {
        const { password, ...userProfile } = matched;
        const newState: AuthState = {
          isAuthenticated: true,
          currentUser: userProfile,
          token: `session-${Date.now()}`
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newState));
        set(newState);
        return {
          success: true,
          message: `Selamat datang kembali, ${userProfile.name}!`,
          user: userProfile
        };
      }

      return {
        success: false,
        message: 'Kredensial tidak sesuai. Gunakan akun coba sementara di bawah.'
      };
    },

    // Logout
    logout: () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      set({
        isAuthenticated: false,
        currentUser: null
      });
    }
  };
}

export const authStore = createAuthStore();

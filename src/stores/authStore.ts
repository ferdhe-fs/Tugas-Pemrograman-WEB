import { writable } from 'svelte/store';
import type { AuthState, User, UserRole } from '../types/auth';

const SESSION_STORAGE_KEY = 'sibermu_auth_session';
const USERS_REGISTRY_KEY = 'sibermu_users_registry';

export interface RegisteredAccount extends User {
  password: string;
}

// Data akun resmi yang sudah terdaftar di sistem (hanya akun ini yang bisa login)
export const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'usr-mhs-01',
    username: '230101001',
    password: 'password123',
    name: 'Ahmad Fauzan Syahputra',
    email: 'fauzan.mhs@sibermu.ac.id',
    role: 'mahasiswa',
    identifierNumber: '230101001', // NIK / NIM Mahasiswa
    department: 'S1 Informatika',
    semester: 4,
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ahmad+Fauzan'
  },
  {
    id: 'usr-dsn-01',
    username: '0612048501',
    password: 'password123',
    name: 'Dr. Ir. Muhammad Arifin, M.Kom.',
    email: 'm.arifin@sibermu.ac.id',
    role: 'dosen',
    identifierNumber: '0612048501', // NIK / NIDN Dosen
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
    console.error('Gagal membaca data pengguna:', err);
  }
  // Simpan akun resmi ke storage
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(REGISTERED_ACCOUNTS));
  } catch (e) {
    console.error(e);
  }
  return REGISTERED_ACCOUNTS;
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
    console.error('Gagal membaca sesi:', err);
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

    // Login hanya dengan NIK dan Role yang sudah terdaftar
    loginWithNikAndRole: (
      nikInput: string,
      passwordInput: string,
      roleInput: UserRole
    ): { success: boolean; message: string; user?: User } => {
      const users = getStoredUsers();
      const trimmedNik = nikInput.trim().toLowerCase();

      // Cari user berdasarkan NIK / NIM / NIDN atau username
      const matched = users.find(
        (acc) =>
          acc.identifierNumber.toLowerCase() === trimmedNik ||
          acc.username.toLowerCase() === trimmedNik
      );

      if (!matched) {
        return {
          success: false,
          message: 'Nomor Induk (NIK/NIM/NIDN) belum terdaftar di sistem SIAKAD.'
        };
      }

      // Validasi kesesuaian peran
      if (matched.role !== roleInput) {
        const roleLabel = matched.role === 'dosen' ? 'Dosen' : 'Mahasiswa';
        return {
          success: false,
          message: `Nomor Induk ini terdaftar sebagai ${roleLabel}. Silakan pilih peran yang sesuai.`
        };
      }

      // Validasi kata sandi
      if (matched.password !== passwordInput) {
        return {
          success: false,
          message: 'Kata sandi tidak sesuai. Silakan periksa kembali.'
        };
      }

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
        message: `Selamat datang, ${userProfile.name}!`,
        user: userProfile
      };
    },

    // Logout
    logout: () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem('sibermu_active_tab');
      if (typeof window !== 'undefined') {
        window.location.hash = '';
      }
      set({
        isAuthenticated: false,
        currentUser: null
      });
    }
  };
}

export const authStore = createAuthStore();

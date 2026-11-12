import { writable } from 'svelte/store';
import type { AuthState, User, UserRole } from '../types/auth';

const SESSION_STORAGE_KEY = 'sibermu_auth_session';
const USERS_REGISTRY_KEY = 'sibermu_users_registry';

export interface RegisteredAccount extends User {
  password: string;
}

// Data akun resmi bawaan yang terdaftar di sistem
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
  // Gunakan Map agar akun resmi selalu tersedia & akun custom tetap terjaga
  const userMap = new Map<string, RegisteredAccount>();

  // 1. Selalu daftarkan akun resmi
  for (const acc of REGISTERED_ACCOUNTS) {
    userMap.set(acc.identifierNumber.trim().toLowerCase(), acc);
  }

  // 2. Baca dan gabungkan akun dari localStorage jika ada
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && item.identifierNumber) {
            const key = item.identifierNumber.trim().toLowerCase();
            if (!userMap.has(key)) {
              userMap.set(key, item);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Gagal membaca data pengguna:', err);
  }

  const list = Array.from(userMap.values());
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
  return list;
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

      // Cari user berdasarkan NIK / NIM / NIDN dan peran yang dipilih
      const matched = users.find(
        (acc) =>
          (acc.identifierNumber.trim().toLowerCase() === trimmedNik ||
            acc.username.trim().toLowerCase() === trimmedNik) &&
          acc.role === roleInput
      );

      if (!matched) {
        return {
          success: false,
          message: 'Nomor Induk tidak terdaftar di sistem.'
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

    // Tambah akun langsung (jika user ingin mendaftarkan NIK aslinya)
    registerDirectAccount: (acc: RegisteredAccount) => {
      const users = getStoredUsers();
      users.push(acc);
      try {
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
      } catch (e) {
        console.error(e);
      }
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

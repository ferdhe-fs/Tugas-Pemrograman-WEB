import { writable } from 'svelte/store';
import type { AuthState, User, UserRole } from '../types/auth';

const SESSION_KEY = 'sibermu_auth_session';
const USERS_KEY = 'sibermu_users_registry';

export interface RegisteredAccount extends User {
  password: string;
}

export const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'usr-student',
    name: 'MAHASISWA',
    identifierNumber: '230101001',
    password: 'password123',
    role: 'student',
    email: 'student@sibermu.ac.id',
    department: 'Sistem Informatika',
    semester: 4
  },
  {
    id: 'usr-lecturer',
    name: 'DOSEN',
    identifierNumber: '0612048501',
    password: 'password123',
    role: 'lecturer',
    email: 'lecturer@sibermu.ac.id',
    department: 'Sistem Informatika'
  }
];

function getStoredUsers(): RegisteredAccount[] {
  const map = new Map<string, RegisteredAccount>();
  for (const acc of REGISTERED_ACCOUNTS) {
    map.set(acc.identifierNumber.toLowerCase(), acc);
  }

  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.identifierNumber && !map.has(item.identifierNumber.toLowerCase())) {
            map.set(item.identifierNumber.toLowerCase(), item);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  const list = Array.from(map.values());
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
  return list;
}

function getInitialSession(): AuthState {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.currentUser) {
        // Sync department with master registered accounts
        const matched = REGISTERED_ACCOUNTS.find(
          (a) => a.identifierNumber.toLowerCase() === parsed.currentUser.identifierNumber?.toLowerCase()
        );
        if (matched) {
          parsed.currentUser.department = matched.department;
          localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        }
        return { isAuthenticated: true, currentUser: parsed.currentUser };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { isAuthenticated: false, currentUser: null };
}

function createAuthStore() {
  const { subscribe, set } = writable<AuthState>(getInitialSession());

  return {
    subscribe,

    login: (idNumber: string, passwordInput: string, roleInput: UserRole) => {
      const users = getStoredUsers();
      const trimmed = idNumber.trim().toLowerCase();

      const matched = users.find(
        (u) => u.identifierNumber.toLowerCase() === trimmed && u.role === roleInput
      );

      if (!matched) {
        return { success: false, message: 'ID number is not registered for this role.' };
      }

      if (matched.password !== passwordInput) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      const { password, ...profile } = matched;
      const state: AuthState = { isAuthenticated: true, currentUser: profile };
      localStorage.setItem(SESSION_KEY, JSON.stringify(state));
      set(state);
      return { success: true, message: `Welcome, ${profile.name}!` };
    },

    logout: () => {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem('sibermu_active_tab');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/login');
      }
      set({ isAuthenticated: false, currentUser: null });
    }
  };
}

export const authStore = createAuthStore();

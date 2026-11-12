import { writable } from 'svelte/store';
import type { Course } from '../types/academic';

const COURSES_STORAGE_KEY = 'sibermu_academic_courses';

export const INITIAL_DEMO_COURSES: Course[] = [
  {
    id: 'crs-001',
    code: 'IF201',
    name: 'Pemrograman Berbasis Web',
    sks: 3,
    lecturer: 'Dr. Ir. Muhammad Arifin, M.Kom.',
    day: 'Senin',
    time: '08:00 - 10:30',
    room: 'LMS SiberMu (Online)',
    status: 'Disetujui',
    studentName: 'Ahmad Fauzan Syahputra',
    studentId: '230101001'
  },
  {
    id: 'crs-002',
    code: 'IF203',
    name: 'Basis Data & SQL Terapan',
    sks: 3,
    lecturer: 'Dewi Rahmawati, M.Cs.',
    day: 'Selasa',
    time: '10:45 - 13:15',
    room: 'LMS SiberMu (Online)',
    status: 'Disetujui',
    studentName: 'Ahmad Fauzan Syahputra',
    studentId: '230101001'
  },
  {
    id: 'crs-003',
    code: 'IF205',
    name: 'Rekayasa Perangkat Lunak',
    sks: 3,
    lecturer: 'Dr. Ir. Muhammad Arifin, M.Kom.',
    day: 'Rabu',
    time: '13:30 - 16:00',
    room: 'LMS SiberMu (Online)',
    status: 'Menunggu',
    studentName: 'Ahmad Fauzan Syahputra',
    studentId: '230101001'
  },
  {
    id: 'crs-004',
    code: 'IF207',
    name: 'Keamanan Siber & Jaringan',
    sks: 3,
    lecturer: 'Hadi Pranoto, M.T.',
    day: 'Kamis',
    time: '09:00 - 11:30',
    room: 'LMS SiberMu (Online)',
    status: 'Menunggu',
    studentName: 'Ahmad Fauzan Syahputra',
    studentId: '230101001'
  }
];

function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Gagal membaca data mata kuliah:', err);
  }
  // Pasang data dummy sementara jika kosong
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COURSES));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEMO_COURSES;
}

export const courseStore = writable<Course[]>(getStoredCourses());

courseStore.subscribe((courses) => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (err) {
    console.error('Gagal menyimpan mata kuliah:', err);
  }
});

export function addCourse(newCourse: Omit<Course, 'id' | 'status'>): void {
  const item: Course = {
    ...newCourse,
    id: `crs-${Date.now()}`,
    status: 'Menunggu'
  };
  courseStore.update((list) => [item, ...list]);
}

export function deleteCourse(courseId: string): void {
  courseStore.update((list) => list.filter((c) => c.id !== courseId));
}

export function setCourseStatus(courseId: string, status: 'Disetujui' | 'Menunggu'): void {
  courseStore.update((list) =>
    list.map((c) => (c.id === courseId ? { ...c, status } : c))
  );
}

export function toggleCourseStatus(courseId: string): void {
  courseStore.update((courses) =>
    courses.map((c) => {
      if (c.id === courseId) {
        const nextStatus = c.status === 'Disetujui' ? 'Menunggu' : 'Disetujui';
        return { ...c, status: nextStatus };
      }
      return c;
    })
  );
}

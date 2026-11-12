import { writable } from 'svelte/store';
import type { Course, ActivityLog } from '../types/academic';

const COURSES_STORAGE_KEY = 'sibermu_academic_courses';
const ACTIVITIES_STORAGE_KEY = 'sibermu_academic_activities';

function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Gagal membaca data mata kuliah:', err);
  }
  return []; // Tanpa data dummy sama sekali
}

function getStoredActivities(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Gagal membaca data aktivitas:', err);
  }
  return []; // Tanpa data dummy sama sekali
}

export const courseStore = writable<Course[]>(getStoredCourses());
export const activityStore = writable<ActivityLog[]>(getStoredActivities());

// Simpan otomatis ke localStorage setiap kali ada perubahan
courseStore.subscribe((courses) => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (err) {
    console.error('Gagal menyimpan mata kuliah:', err);
  }
});

activityStore.subscribe((activities) => {
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error('Gagal menyimpan riwayat aktivitas:', err);
  }
});

export function addCourse(newCourse: Omit<Course, 'id' | 'status'>): void {
  const item: Course = {
    ...newCourse,
    id: `crs-${Date.now()}`,
    status: 'Menunggu'
  };

  courseStore.update((list) => [item, ...list]);

  // Tambahkan log aktivitas
  addActivity(`Pengajuan KRS mata kuliah baru: ${item.name} (${item.code})`, 'info');
}

export function deleteCourse(courseId: string): void {
  courseStore.update((list) => {
    const target = list.find((c) => c.id === courseId);
    if (target) {
      addActivity(`Mata kuliah "${target.name}" dihapus dari rencana studi`, 'warning');
    }
    return list.filter((c) => c.id !== courseId);
  });
}

export function toggleCourseStatus(courseId: string): void {
  courseStore.update((courses) =>
    courses.map((c) => {
      if (c.id === courseId) {
        const nextStatus = c.status === 'Disetujui' ? 'Menunggu' : 'Disetujui';
        addActivity(
          `Status mata kuliah "${c.name}" diubah menjadi: ${nextStatus}`,
          nextStatus === 'Disetujui' ? 'success' : 'warning'
        );
        return { ...c, status: nextStatus };
      }
      return c;
    })
  );
}

export function addActivity(action: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info'): void {
  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    action,
    timestamp: 'Baru saja',
    type
  };
  activityStore.update((logs) => [newLog, ...logs].slice(0, 10)); // simpan 10 terakhir
}

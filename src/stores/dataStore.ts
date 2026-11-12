import { writable } from 'svelte/store';
import type { Course } from '../types/academic';

const COURSES_STORAGE_KEY = 'sibermu_academic_courses';

function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Gagal membaca data mata kuliah:', err);
  }
  return [];
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

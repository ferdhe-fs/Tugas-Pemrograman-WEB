import { writable, derived } from 'svelte/store';
import type { Course, SemesterTranscript } from '../types/academic';

const COURSES_KEY = 'sibermu_academic_courses';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-1',
    code: 'IF201',
    name: 'Web Application Development',
    credits: 3,
    lecturer: 'DOSEN',
    day: 'Monday',
    time: '08:00 - 10:30',
    room: 'SiberMu LMS (Online)',
    status: 'Approved',
    studentName: 'MAHASISWA',
    studentId: '230101001',
    semester: 4
  },
  {
    id: 'crs-2',
    code: 'IF203',
    name: 'Database Systems & SQL',
    credits: 3,
    lecturer: 'DOSEN',
    day: 'Tuesday',
    time: '10:45 - 13:15',
    room: 'SiberMu LMS (Online)',
    status: 'Approved',
    studentName: 'MAHASISWA',
    studentId: '230101001',
    semester: 4
  },
  {
    id: 'crs-3',
    code: 'IF205',
    name: 'Software Engineering',
    credits: 3,
    lecturer: 'DOSEN',
    day: 'Wednesday',
    time: '13:30 - 16:00',
    room: 'SiberMu LMS (Online)',
    status: 'Pending',
    studentName: 'MAHASISWA',
    studentId: '230101001',
    semester: 4
  },
  {
    id: 'crs-4',
    code: 'IF207',
    name: 'Cybersecurity & Computer Networks',
    credits: 3,
    lecturer: 'DOSEN',
    day: 'Thursday',
    time: '09:00 - 11:30',
    room: 'SiberMu LMS (Online)',
    status: 'Pending',
    studentName: 'MAHASISWA',
    studentId: '230101001',
    semester: 4
  }
];

// Raw transcript grade data with dynamic calculation
export const INITIAL_SEMESTERS_DATA: Omit<SemesterTranscript, 'semesterGpa' | 'totalCredits'>[] = [
  {
    semester: 1,
    academicYear: '2024/2025 Odd',
    courses: [
      { code: 'IF101', name: 'Introduction to Computer Science', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF102', name: 'Algorithms & Programming', credits: 4, grade: 'A', point: 4.0 },
      { code: 'IF103', name: 'Discrete Mathematics', credits: 3, grade: 'A-', point: 3.75 },
      { code: 'UN101', name: 'Islamic Studies & Ethics', credits: 2, grade: 'A', point: 4.0 },
      { code: 'UN102', name: 'Civic Education', credits: 2, grade: 'B+', point: 3.5 },
      { code: 'UN103', name: 'English for Academic Purposes', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF104', name: 'Computer Hardware Fundamentals', credits: 3, grade: 'A-', point: 3.75 }
    ]
  },
  {
    semester: 2,
    academicYear: '2024/2025 Even',
    courses: [
      { code: 'IF105', name: 'Object-Oriented Programming', credits: 4, grade: 'A', point: 4.0 },
      { code: 'IF106', name: 'Data Structures', credits: 4, grade: 'A-', point: 3.75 },
      { code: 'IF107', name: 'Computer Organization & Architecture', credits: 3, grade: 'B+', point: 3.5 },
      { code: 'IF108', name: 'Linear Algebra & Matrices', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF109', name: 'Operating Systems', credits: 3, grade: 'A', point: 4.0 },
      { code: 'UN104', name: 'Bahasa Indonesia', credits: 2, grade: 'A', point: 4.0 },
      { code: 'UN105', name: 'Muhammadiyah Studies', credits: 2, grade: 'A', point: 4.0 }
    ]
  },
  {
    semester: 3,
    academicYear: '2025/2026 Odd',
    courses: [
      { code: 'IF201', name: 'Web Application Development', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF202', name: 'Artificial Intelligence Basics', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF203', name: 'Database Systems & SQL', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF204', name: 'Statistics & Probability', credits: 3, grade: 'A-', point: 3.75 },
      { code: 'IF205', name: 'Human-Computer Interaction', credits: 3, grade: 'A', point: 4.0 },
      { code: 'IF206', name: 'Formal Languages & Automata', credits: 3, grade: 'B+', point: 3.5 },
      { code: 'UN106', name: 'Digital Entrepreneurship', credits: 2, grade: 'A', point: 4.0 }
    ]
  }
];

// Helper kalkulasi dinamis transkrip
export function computeTranscripts(): SemesterTranscript[] {
  return INITIAL_SEMESTERS_DATA.map((sem) => {
    const totalCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = sem.courses.reduce((sum, c) => sum + c.credits * c.point, 0);
    const semesterGpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
    return {
      ...sem,
      totalCredits,
      semesterGpa
    };
  });
}

function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error(err);
  }
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_COURSES;
}

export const courseStore = writable<Course[]>(getStoredCourses());

courseStore.subscribe((val) => {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
});

// Derived Stores Dinamis
export const totalCreditsStore = derived(courseStore, ($courses) =>
  $courses.reduce((sum, c) => sum + c.credits, 0)
);

export const approvedCreditsStore = derived(courseStore, ($courses) =>
  $courses.filter((c) => c.status === 'Approved').reduce((sum, c) => sum + c.credits, 0)
);

export const pendingCoursesStore = derived(courseStore, ($courses) =>
  $courses.filter((c) => c.status === 'Pending')
);

export const approvedCoursesStore = derived(courseStore, ($courses) =>
  $courses.filter((c) => c.status === 'Approved')
);

export function addCourse(newCourse: Omit<Course, 'id' | 'status'>): void {
  const item: Course = {
    ...newCourse,
    id: `crs-${Date.now()}`,
    status: 'Pending'
  };
  courseStore.update((list) => [item, ...list]);
}

export function deleteCourse(id: string): void {
  courseStore.update((list) => list.filter((c) => c.id !== id));
}

export function setCourseStatus(id: string, status: 'Approved' | 'Pending'): void {
  courseStore.update((list) =>
    list.map((c) => (c.id === id ? { ...c, status } : c))
  );
}

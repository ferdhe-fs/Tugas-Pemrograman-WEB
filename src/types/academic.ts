export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  day: string;
  time: string;
  room: string;
  status: 'Approved' | 'Pending';
  studentName?: string;
  studentId?: string;
  semester?: number;
}

export interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  point: number;
}

export interface SemesterTranscript {
  semester: number;
  academicYear: string;
  courses: CourseGrade[];
  semesterGpa: number;
  totalCredits: number;
}

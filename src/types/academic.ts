export interface Course {
  id: string;
  code: string;
  name: string;
  sks: number;
  lecturer: string;
  day: string;
  time: string;
  room: string;
  status: 'Disetujui' | 'Menunggu';
  studentName?: string;
  studentId?: string;
}

export interface TeachingCourse {
  id: string;
  code: string;
  name: string;
  sks: number;
  schedule: string;
  room: string;
  totalStudents: number;
}

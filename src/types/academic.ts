export interface Course {
  id: string;
  code: string;
  name: string;
  sks: number;
  lecturer: string;
  day: string;
  time: string;
  room: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  bgGradient: string;
}

export enum GradeLevel {
  NA = 'N/A',
  E = 'E',
  G = 'G',
  Q = 'Q',
  D = 'D',
}

export interface Task {
  id: string;
  name: string;
  createdAt: number;
}

export interface Student {
  id: string;
  name: string;
  // Key is Task ID, Value is GradeLevel
  grades: Record<string, GradeLevel>;
}

export interface ClassGroup {
  id: string;
  name: string;
  students: Student[];
  tasks: Task[];
}

export interface GradeStyle {
  bg: string;
  text: string;
  label: string;
  fullLabel: string;
}
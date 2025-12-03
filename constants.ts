import { GradeLevel, GradeStyle } from './types';

export const GRADE_CONFIG: Record<GradeLevel, GradeStyle> = {
  [GradeLevel.NA]: {
    bg: 'bg-gray-200',
    text: 'text-black',
    label: 'N/A',
    fullLabel: 'Not Started',
  },
  [GradeLevel.E]: {
    bg: 'bg-green-800',
    text: 'text-white',
    label: 'E',
    fullLabel: 'Excellent',
  },
  [GradeLevel.G]: {
    bg: 'bg-blue-800',
    text: 'text-white',
    label: 'G',
    fullLabel: 'Good',
  },
  [GradeLevel.Q]: {
    bg: 'bg-yellow-400',
    text: 'text-black',
    label: 'Q',
    fullLabel: 'Questionable',
  },
  [GradeLevel.D]: {
    bg: 'bg-red-600',
    text: 'text-white',
    label: 'D',
    fullLabel: 'Deficient',
  },
};

export const GRADE_CYCLE_ORDER: GradeLevel[] = [
  GradeLevel.NA,
  GradeLevel.E,
  GradeLevel.G,
  GradeLevel.Q,
  GradeLevel.D,
];

// Helper to get next grade
export const getNextGrade = (current: GradeLevel): GradeLevel => {
  const currentIndex = GRADE_CYCLE_ORDER.indexOf(current);
  const nextIndex = (currentIndex + 1) % GRADE_CYCLE_ORDER.length;
  return GRADE_CYCLE_ORDER[nextIndex];
};

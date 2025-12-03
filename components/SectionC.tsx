import React, { useState, useEffect } from 'react';
import { ClassGroup, GradeLevel } from '../types';
import { GRADE_CONFIG, getNextGrade } from '../constants';

interface SectionCProps {
  currentClass: ClassGroup | undefined;
  onUpdateGrade: (classId: string, studentId: string, taskId: string, newGrade: GradeLevel) => void;
}

export const SectionC: React.FC<SectionCProps> = ({ currentClass, onUpdateGrade }) => {
  // State for the currently selected task for rapid tracking
  const [activeTaskId, setActiveTaskId] = useState<string>('');

  // Update active task when class changes or tasks change
  useEffect(() => {
    if (currentClass && currentClass.tasks.length > 0) {
        // If no active task or the active task no longer exists, default to the most recent one
        if (!activeTaskId || !currentClass.tasks.find(t => t.id === activeTaskId)) {
            setActiveTaskId(currentClass.tasks[currentClass.tasks.length - 1].id);
        }
    } else {
        setActiveTaskId('');
    }
  }, [currentClass, currentClass?.tasks, activeTaskId]);

  if (!currentClass) {
    return <div className="text-slate-500 italic p-4 text-center">Please select a class in Section B to view tracking.</div>;
  }

  if (currentClass.students.length === 0) {
     return <div className="text-slate-500 italic p-4 text-center">No students in this class. Import students in Section A.</div>;
  }

  if (currentClass.tasks.length === 0) {
    return <div className="text-slate-500 italic p-4 text-center">No tasks available. Create a task in Section B.</div>;
  }

  const activeTask = currentClass.tasks.find(t => t.id === activeTaskId);

  const handleStudentClick = (studentId: string, currentGrade: GradeLevel) => {
    if (!activeTaskId) return;
    const nextGrade = getNextGrade(currentGrade);
    onUpdateGrade(currentClass.id, studentId, activeTaskId, nextGrade);
  };

  return (
    <div className="space-y-6">
      {/* Task Selector Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Select Task to Grade</label>
        <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
            {currentClass.tasks.map(task => (
                <button
                    key={task.id}
                    onClick={() => setActiveTaskId(task.id)}
                    className={`px-5 py-3 rounded-t-lg font-medium whitespace-nowrap transition-colors min-w-[100px] ${
                        activeTaskId === task.id 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {task.name}
                </button>
            ))}
        </div>
      </div>

      {/* Active Task Context */}
      {activeTask && (
         <div className="flex justify-between items-end px-1">
            <div>
                <h3 className="text-2xl font-bold text-slate-800">
                    {activeTask.name}
                </h3>
                <p className="text-sm text-slate-500">
                    Tap a student card to cycle their grade.
                </p>
            </div>
            
            {/* Simple Legend for reference */}
            <div className="hidden sm:flex gap-2 text-xs">
                {Object.values(GRADE_CONFIG).slice(1).map(style => (
                    <span key={style.label} className={`px-2 py-1 rounded ${style.bg} ${style.text} opacity-80`}>
                        {style.label}
                    </span>
                ))}
            </div>
         </div>
      )}

      {/* Student Grid (Left to Right) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentClass.students.map((student) => {
            const grade = activeTask ? (student.grades[activeTask.id] || GradeLevel.NA) : GradeLevel.NA;
            const style = GRADE_CONFIG[grade];
            
            return (
                <button
                    key={student.id}
                    onClick={() => handleStudentClick(student.id, grade)}
                    className={`${style.bg} ${style.text} p-6 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-150 active:scale-95 flex flex-col items-center justify-center gap-2 border-2 border-transparent relative group min-h-[120px]`}
                >
                    {/* Grade indicator watermark (optional style choice) */}
                    <span className="absolute top-2 right-2 text-xs font-bold opacity-60 border border-current px-1.5 py-0.5 rounded">
                        {style.label}
                    </span>

                    <span className="text-lg sm:text-xl font-bold text-center leading-tight break-words w-full select-none">
                        {student.name}
                    </span>
                    
                    <span className="text-xs uppercase opacity-80 font-semibold tracking-wider mt-1">
                        {style.fullLabel}
                    </span>
                </button>
            );
        })}
      </div>
    </div>
  );
};
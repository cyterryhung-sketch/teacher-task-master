import React from 'react';
import { ClassGroup, GradeLevel } from '../types';
import { GRADE_CONFIG } from '../constants';

interface SectionDProps {
  currentClass: ClassGroup | undefined;
}

export const SectionD: React.FC<SectionDProps> = ({ currentClass }) => {
  if (!currentClass) {
    return <div className="text-slate-500 italic p-4 text-center">Please select a class to view the matrix.</div>;
  }
  
  if (currentClass.students.length === 0 || currentClass.tasks.length === 0) {
      return <div className="text-slate-500 italic p-4 text-center">Add students and tasks to generate the matrix.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs justify-end px-2 flex-wrap">
            {Object.values(GRADE_CONFIG).map((style) => (
                <div key={style.label} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-sm ${style.bg} border border-slate-200`}></div>
                    <span className="text-slate-600">{style.fullLabel}</span>
                </div>
            ))}
        </div>

        {/* Matrix */}
        <div className="grid border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
             style={{
                 gridTemplateColumns: `minmax(120px, auto) repeat(${currentClass.tasks.length}, minmax(40px, 1fr))`
             }}>
          
          {/* Header Row */}
          <div className="bg-slate-100 p-2 font-semibold text-xs text-slate-700 flex items-center justify-center border-b border-r border-slate-200">
            Student / Task
          </div>
          {currentClass.tasks.map((task) => (
            <div key={task.id} className="bg-slate-100 p-2 font-semibold text-xs text-slate-700 border-b border-slate-200 text-center truncate" title={task.name}>
              {task.name.substring(0, 10)}{task.name.length > 10 ? '...' : ''}
            </div>
          ))}

          {/* Data Rows */}
          {currentClass.students.map((student) => (
            <React.Fragment key={student.id}>
              {/* Row Header */}
              <div className="p-2 text-xs font-medium text-slate-900 border-r border-b border-slate-100 bg-slate-50 truncate" title={student.name}>
                {student.name}
              </div>
              
              {/* Cells */}
              {currentClass.tasks.map((task) => {
                const grade = student.grades[task.id] || GradeLevel.NA;
                const style = GRADE_CONFIG[grade];
                return (
                  <div 
                    key={`${student.id}-${task.id}`} 
                    className={`h-8 w-full ${style.bg} border-b border-slate-100 border-r border-white/10 opacity-90 hover:opacity-100 transition-opacity`}
                    title={`${student.name} - ${task.name}: ${style.fullLabel}`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
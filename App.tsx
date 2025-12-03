import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Settings, Users, CheckSquare, BarChart2 } from 'lucide-react';

import { CollapsibleSection } from './components/CollapsibleSection';
import { SectionA } from './components/SectionA';
import { SectionB } from './components/SectionB';
import { SectionC } from './components/SectionC';
import { SectionD } from './components/SectionD';

import { ClassGroup, GradeLevel, Student, Task } from './types';

function App() {
  // --- State ---
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);

  // Section visibility state (A & B default collapsed, C & D default expanded)
  const [openSections, setOpenSections] = useState({
    A: false,
    B: false,
    C: true,
    D: true,
  });

  // --- Persistence ---
  
  // Load initial data
  useEffect(() => {
    const savedData = localStorage.getItem('teacherTaskMasterData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setClasses(parsedData);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save function
  const saveData = useCallback(() => {
    localStorage.setItem('teacherTaskMasterData', JSON.stringify(classes));
    // Optional: Add a toast notification here
    console.log('Data saved');
    // Using simple alert for now as a feedback mechanism, in a real app would be a toast
    // alert("Data Saved Successfully!"); 
  }, [classes]);

  // Keyboard Shortcuts (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveData]);

  // --- Handlers ---

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addClass = (name: string) => {
    const newClass: ClassGroup = {
      id: uuidv4(),
      name,
      students: [],
      tasks: [],
    };
    setClasses((prev) => [...prev, newClass]);
    setCurrentClassId(newClass.id);
    // Auto-open Section B to start adding details
    setOpenSections(prev => ({ ...prev, B: true }));
  };

  const importStudents = (classId: string, names: string[]) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        
        const newStudents: Student[] = names.map((name) => ({
          id: uuidv4(),
          name,
          grades: {}, // Initialize grades
        }));

        // Initialize grades for existing tasks for new students
        newStudents.forEach(s => {
            c.tasks.forEach(t => {
                s.grades[t.id] = GradeLevel.NA;
            });
        });

        return {
          ...c,
          students: [...c.students, ...newStudents],
        };
      })
    );
  };

  const addTask = (classId: string, name: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        
        const newTask: Task = {
          id: uuidv4(),
          name,
          createdAt: Date.now(),
        };

        // Initialize grades for this task for all students (Requirement R.4)
        const updatedStudents = c.students.map((s) => ({
          ...s,
          grades: {
            ...s.grades,
            [newTask.id]: GradeLevel.NA,
          },
        }));

        return {
          ...c,
          tasks: [...c.tasks, newTask],
          students: updatedStudents,
        };
      })
    );
  };

  const editTask = (classId: string, taskId: string, newName: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, name: newName } : t)),
        };
      })
    );
  };

  const deleteTask = (classId: string, taskId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        
        // Remove task
        const updatedTasks = c.tasks.filter((t) => t.id !== taskId);
        
        // Clean up grades for this task
        const updatedStudents = c.students.map(s => {
            const newGrades = { ...s.grades };
            delete newGrades[taskId];
            return { ...s, grades: newGrades };
        });

        return {
          ...c,
          tasks: updatedTasks,
          students: updatedStudents,
        };
      })
    );
  };

  const updateGrade = (classId: string, studentId: string, taskId: string, newGrade: GradeLevel) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          students: c.students.map((s) => {
            if (s.id !== studentId) return s;
            return {
              ...s,
              grades: {
                ...s.grades,
                [taskId]: newGrade,
              },
            };
          }),
        };
      })
    );
  };

  const currentClass = classes.find((c) => c.id === currentClassId);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Teacher Task Master</h1>
                <p className="text-slate-500 mt-1">Efficiently manage assignments and track progress.</p>
            </div>
            {currentClass && (
                 <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm">
                    Active Class: {currentClass.name}
                 </div>
            )}
        </header>

        {/* Section A: Settings & Management */}
        <CollapsibleSection
          id="A"
          title="Settings & Management"
          icon={<Settings />}
          isOpen={openSections.A}
          onToggle={() => toggleSection('A')}
        >
          <SectionA
            classes={classes}
            currentClassId={currentClassId}
            onAddClass={addClass}
            onImportStudents={importStudents}
            onSave={saveData}
          />
        </CollapsibleSection>

        {/* Section B: Class & Task Area */}
        <CollapsibleSection
          id="B"
          title="Class & Task Manager"
          icon={<CheckSquare />}
          isOpen={openSections.B}
          onToggle={() => toggleSection('B')}
        >
          <SectionB
            classes={classes}
            currentClassId={currentClassId}
            onSelectClass={setCurrentClassId}
            onAddTask={addTask}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
          />
        </CollapsibleSection>

        {/* Section C: Real-time Tracking */}
        <CollapsibleSection
          id="C"
          title="Real-time Tracking"
          icon={<Users />}
          isOpen={openSections.C}
          onToggle={() => toggleSection('C')}
        >
          <SectionC
            currentClass={currentClass}
            onUpdateGrade={updateGrade}
          />
        </CollapsibleSection>

        {/* Section D: Overview Matrix */}
        <CollapsibleSection
          id="D"
          title="Class Overview Matrix"
          icon={<BarChart2 />}
          isOpen={openSections.D}
          onToggle={() => toggleSection('D')}
        >
          <SectionD currentClass={currentClass} />
        </CollapsibleSection>
        
        <footer className="mt-12 text-center text-slate-400 text-sm">
            <p>Teacher Task Master &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
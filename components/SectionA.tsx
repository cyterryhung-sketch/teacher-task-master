import React, { useState } from 'react';
import { ClassGroup, GradeLevel } from '../types';
import * as XLSX from 'xlsx';
import { Download, Upload, Plus, Save } from 'lucide-react';

interface SectionAProps {
  classes: ClassGroup[];
  currentClassId: string | null;
  onAddClass: (name: string) => void;
  onImportStudents: (classId: string, names: string[]) => void;
  onSave: () => void;
}

export const SectionA: React.FC<SectionAProps> = ({
  classes,
  currentClassId,
  onAddClass,
  onImportStudents,
  onSave,
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    onAddClass(newClassName);
    setNewClassName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const processImport = () => {
    if (!importFile || !currentClassId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      
      // Split by newline or comma
      const names = text
        .split(/[,\n]/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      
      onImportStudents(currentClassId, names);
      setImportFile(null);
      // Reset input manually if needed, simplified here
    };
    reader.readAsText(importFile);
  };

  const handleExport = () => {
    if (!currentClassId) return;
    const cls = classes.find((c) => c.id === currentClassId);
    if (!cls) return;

    // Build data structure for SheetJS
    // Header Row: Student Name, ...Task Names
    const header = ['Student Name', ...cls.tasks.map((t) => t.name)];
    
    // Data Rows
    const data = cls.students.map((student) => {
      const row: (string | number)[] = [student.name];
      cls.tasks.forEach((task) => {
        row.push(student.grades[task.id] || GradeLevel.NA);
      });
      return row;
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, cls.name.substring(0, 31)); // Sheet name max 31 chars
    XLSX.writeFile(wb, `${cls.name}_Report.xlsx`);
  };

  const currentClass = classes.find((c) => c.id === currentClassId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Create Class */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="font-semibold mb-3 text-slate-700">Create Class</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Class Name (e.g., Math 101)"
            className="flex-1 p-2 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleCreateClass}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Manual Save Trigger */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
        <div>
           <h3 className="font-semibold text-slate-700">Data Persistence</h3>
           <p className="text-sm text-slate-500">Shortcut: Ctrl + S / Cmd + S</p>
        </div>
        <button
            onClick={onSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
            <Save size={18} /> Save Data
        </button>
      </div>

      {/* Import Students */}
      <div className={`bg-slate-50 p-4 rounded-lg border border-slate-200 ${!currentClassId ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-semibold mb-3 text-slate-700">Import Students</h3>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-500">Upload CSV/TXT with student names (one per line or comma-separated).</p>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={processImport}
              disabled={!importFile}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-slate-300 flex items-center gap-2"
            >
              <Upload size={18} /> Import
            </button>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <div className={`bg-slate-50 p-4 rounded-lg border border-slate-200 ${!currentClassId ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-semibold mb-3 text-slate-700">Export Class Data</h3>
        <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
                Current Class: <span className="font-bold">{currentClass?.name || 'None'}</span>
            </div>
            <button
                onClick={handleExport}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2"
            >
                <Download size={18} /> Export XLSX
            </button>
        </div>
      </div>
    </div>
  );
};
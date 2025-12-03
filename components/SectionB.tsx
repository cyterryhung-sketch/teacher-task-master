import React, { useState } from 'react';
import { ClassGroup, Task } from '../types';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';

interface SectionBProps {
  classes: ClassGroup[];
  currentClassId: string | null;
  onSelectClass: (id: string) => void;
  onAddTask: (classId: string, name: string) => void;
  onEditTask: (classId: string, taskId: string, newName: string) => void;
  onDeleteTask: (classId: string, taskId: string) => void;
}

export const SectionB: React.FC<SectionBProps> = ({
  classes,
  currentClassId,
  onSelectClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const currentClass = classes.find((c) => c.id === currentClassId);

  const handleAddTask = () => {
    if (!currentClassId || !newTaskName.trim()) return;
    onAddTask(currentClassId, newTaskName);
    setNewTaskName('');
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditName(task.name);
  };

  const confirmEdit = () => {
    if (!currentClassId || !editingTaskId || !editName.trim()) return;
    onEditTask(currentClassId, editingTaskId, editName);
    setEditingTaskId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditName('');
  };

  const confirmDelete = (taskId: string) => {
    if (!currentClassId) return;
    if (window.confirm('Are you sure you want to delete this task? All student grades for this task will be lost.')) {
      onDeleteTask(currentClassId, taskId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Class Selector */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <label className="font-semibold text-slate-700 whitespace-nowrap">Current Class:</label>
        <select
          value={currentClassId || ''}
          onChange={(e) => onSelectClass(e.target.value)}
          className="w-full md:w-64 p-2 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
        >
          <option value="" disabled>Select a class...</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {currentClassId && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-semibold mb-4 text-slate-700">Task Management</h3>
          
          {/* Add Task */}
          <div className="flex gap-2 mb-6 max-w-2xl">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="New Task Name"
              className="flex-1 p-2 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} /> Create Task
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {currentClass?.tasks.length === 0 ? (
                <p className="text-slate-400 italic text-sm">No tasks created yet.</p>
            ) : (
                currentClass?.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded border border-slate-200 shadow-sm">
                    {editingTaskId === task.id ? (
                        <div className="flex items-center gap-2 flex-1">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 p-1 border border-slate-300 rounded text-sm"
                            autoFocus
                        />
                        <button onClick={confirmEdit} className="text-green-600 hover:text-green-800 p-1">
                            <Check size={18} />
                        </button>
                        <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 p-1">
                            <X size={18} />
                        </button>
                        </div>
                    ) : (
                        <span className="font-medium text-slate-700">{task.name}</span>
                    )}

                    {!editingTaskId && (
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => startEdit(task)}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                            title="Rename"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => confirmDelete(task.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                        </div>
                    )}
                    </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
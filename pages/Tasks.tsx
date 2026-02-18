import React, { useState } from 'react';
import { useCrm } from '../hooks/useCrm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TaskModal from '../components/modals/TaskModal';
import TaskCalendar from '../components/tasks/TaskCalendar';
import { PRIORITY_MAP, STATUS_MAP, ICONS } from '../constants';
import { Link } from 'react-router-dom';
import { Task } from '../types';


const Tasks: React.FC = () => {
  const { tasks, users, leads, deleteTask } = useCrm();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenModal = (task?: Task) => {
    setTaskToEdit(task || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const headerActions = (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-gray-200 rounded-lg p-1">
        <button onClick={() => setView('list')} className={`px-3 py-1 text-sm rounded-md ${view === 'list' ? 'bg-white shadow' : ''}`}>{ICONS.list}</button>
        <button onClick={() => setView('calendar')} className={`px-3 py-1 text-sm rounded-md ${view === 'calendar' ? 'bg-white shadow' : ''}`}>{ICONS.calendar}</button>
      </div>
      <Button onClick={() => handleOpenModal()}>Add New Task</Button>
    </div>
  );

  return (
    <>
      {view === 'list' ? (
        <Card title="All Tasks" className="p-0" headerActions={headerActions}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Associated Lead</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Assigned To</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Due Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Priority</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const lead = leads.find(l => l.id === task.lead_id);
                  const assignedUser = users.find(u => u.id === task.assigned_to);
                  return (
                    <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{task.title}</td>
                      <td className="p-4">
                        {lead ? <Link to="/leads" className="text-primary-600 hover:underline">{lead.name}</Link> : 'N/A'}
                      </td>
                      <td className="p-4">
                        {assignedUser && (
                          <div className="flex items-center gap-2">
                            <img src={assignedUser.avatar} alt={assignedUser.name} className="w-7 h-7 rounded-full" />
                            <span className="text-sm">{assignedUser.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-sm">{task.due_date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_MAP[task.priority].color}`}>{task.priority}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_MAP[task.status].color}`}>{task.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(task)} className="text-gray-400 hover:text-primary-600">{ICONS.edit}</button>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500">{ICONS.trash}</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Task Calendar</h1>
            {headerActions}
          </div>
          <TaskCalendar />
        </div>
      )}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          taskToEdit={taskToEdit}
        />
      )}
    </>
  );
};

export default Tasks;
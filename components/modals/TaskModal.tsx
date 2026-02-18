import React, { useState, useEffect } from 'react';
// FIX: Import TaskPriority and TaskStatus to correctly type the initial state.
import { Task, TaskPriority, TaskStatus } from '../../types';
import { useCrm } from '../../hooks/useCrm';
import { useToast } from '../../hooks/useToast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PRIORITY_MAP, STATUS_MAP } from '../../constants';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
    const { users, leads, addTask, updateTask } = useCrm();
    const { addToast } = useToast();
    
    const getInitialState = () => ({
        title: '',
        lead_id: leads[0]?.id || '',
        assigned_to: users[0]?.id || '',
        due_date: '',
        // FIX: Broaden the type of 'priority' to TaskPriority to avoid type errors when editing a task.
        priority: 'Medium' as TaskPriority,
        // FIX: Broaden the type of 'status' to TaskStatus to avoid type errors when editing a task.
        status: 'Pending' as TaskStatus,
    });

    const [taskData, setTaskData] = useState(getInitialState());

    useEffect(() => {
        if (taskToEdit) {
            setTaskData({
                title: taskToEdit.title,
                lead_id: taskToEdit.lead_id,
                assigned_to: taskToEdit.assigned_to,
                due_date: taskToEdit.due_date,
                priority: taskToEdit.priority,
                status: taskToEdit.status,
            });
        } else {
            setTaskData(getInitialState());
        }
    }, [taskToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskData.title || !taskData.due_date) {
            addToast('Title and Due Date are required.', 'error');
            return;
        }

        if (taskToEdit) {
            updateTask({ ...taskToEdit, ...taskData });
            addToast('Task updated successfully!', 'success');
        } else {
            addTask(taskData);
            addToast('Task added successfully!', 'success');
        }
        onClose();
    };

    return (
        <Modal title={taskToEdit ? 'Edit Task' : 'Add New Task'} isOpen={isOpen} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" value={taskData.title} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Associated Lead</label>
                            <select name="lead_id" value={taskData.lead_id} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {leads.map(lead => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                            <select name="assigned_to" value={taskData.assigned_to} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input type="date" name="due_date" value={taskData.due_date} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                             <select name="priority" value={taskData.priority} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {Object.keys(PRIORITY_MAP).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                             <select name="status" value={taskData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {Object.keys(STATUS_MAP).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{taskToEdit ? 'Save Changes' : 'Add Task'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskModal;

import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';
import { useCrm } from '../../hooks/useCrm';
import { useToast } from '../../hooks/useToast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadToEdit?: Lead | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, leadToEdit }) => {
    const { users, settings, addLead, updateLead } = useCrm();
    const { addToast } = useToast();

    const getInitialState = () => ({
        name: '',
        email: '',
        phone: '',
        source: settings.lead_sources[0] || '',
        status: settings.pipeline_stages[0] || 'New',
        assigned_to: users[0]?.id || '',
        purpose: '',
        notes: '',
        deal_value: undefined as number | undefined,
    });

    const [leadData, setLeadData] = useState(getInitialState());

    useEffect(() => {
        if (leadToEdit) {
            setLeadData({
                name: leadToEdit.name,
                email: leadToEdit.email,
                phone: leadToEdit.phone,
                source: leadToEdit.source,
                status: leadToEdit.status,
                assigned_to: leadToEdit.assigned_to,
                purpose: leadToEdit.purpose,
                notes: leadToEdit.notes,
                deal_value: leadToEdit.deal_value,
            });
        } else {
            setLeadData(getInitialState());
        }
    }, [leadToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'deal_value') {
            setLeadData(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
        } else {
            setLeadData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadData.name || !leadData.email) {
            addToast('Name and Email are required.', 'error');
            return;
        }

        if (leadToEdit) {
            updateLead({ ...leadToEdit, ...leadData });
            addToast('Lead updated successfully!', 'success');
        } else {
            addLead(leadData);
            addToast('Lead added successfully!', 'success');
        }
        onClose();
    };

    return (
        <Modal title={leadToEdit ? 'Edit Lead' : 'Add New Lead'} isOpen={isOpen} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" value={leadData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={leadData.email} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" value={leadData.phone} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                            <select name="assigned_to" value={leadData.assigned_to} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" value={leadData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {settings.pipeline_stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Source</label>
                            <select name="source" value={leadData.source} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                                {settings.lead_sources.map(source => <option key={source} value={source}>{source}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Deal Value (₹)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    name="deal_value"
                                    value={leadData.deal_value || ''}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 pl-7 p-2 focus:border-primary-500 focus:ring-primary-500 sm:text-sm border"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Purpose</label>
                        <input type="text" name="purpose" value={leadData.purpose} onChange={handleChange} placeholder="e.g., Agricultural Survey Drone" className="mt-1 w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea name="notes" value={leadData.notes} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded"></textarea>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{leadToEdit ? 'Save Changes' : 'Add Lead'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default LeadModal;

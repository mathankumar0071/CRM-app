import React, { useState } from 'react';
import { useCrm } from '../hooks/useCrm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AiDraftModal from '../components/ai/AiDraftModal';
import LeadModal from '../components/modals/LeadModal';
import { Lead } from '../types';
import { LEAD_STATUS_MAP, ICONS } from '../constants';

const Leads: React.FC = () => {
  const { leads, users, deleteLead } = useCrm();
  const [showAiModal, setShowAiModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [contactMethod, setContactMethod] = useState<'Email' | 'WhatsApp' | 'General'>('Email');

  const handleOpenAiModal = (lead: Lead, method: 'Email' | 'WhatsApp' | 'General') => {
    setSelectedLead(lead);
    setContactMethod(method);
    setShowAiModal(true);
  };

  const handleOpenLeadModal = (lead?: Lead) => {
    setLeadToEdit(lead || null);
    setShowLeadModal(true);
  }

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(leadId);
    }
  }

  const handleCloseModals = () => {
    setShowAiModal(false);
    setShowLeadModal(false);
    setSelectedLead(null);
    setLeadToEdit(null);
  };

  return (
    <>
      <Card title="All Leads" className="p-0" headerActions={<Button onClick={() => handleOpenLeadModal()}>Add Lead</Button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Assigned To</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Purpose</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Deal Value</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Source</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">AI Actions</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const assignedUser = users.find(u => u.id === lead.assigned_to);
                return (
                  <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${LEAD_STATUS_MAP[lead.status].color}`}>{lead.status}</span>
                    </td>
                    <td className="p-4">
                      {assignedUser && (
                        <div className="flex items-center gap-2">
                          <img src={assignedUser.avatar} alt={assignedUser.name} className="w-7 h-7 rounded-full" />
                          <span className="text-sm">{assignedUser.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm">{lead.purpose}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {lead.deal_value ? `₹${lead.deal_value.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-4 text-sm">{lead.source}</td>
                    <td className="p-4 space-x-2 text-center">
                      <Button onClick={() => handleOpenAiModal(lead, 'Email')} variant="secondary" className="text-xs py-1.5 px-3">AI Email</Button>
                      <Button onClick={() => handleOpenAiModal(lead, 'WhatsApp')} variant="secondary" className="text-xs py-1.5 px-3">AI WhatsApp</Button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenLeadModal(lead)} className="text-gray-400 hover:text-primary-600">{ICONS.edit}</button>
                        <button onClick={() => handleDeleteLead(lead.id)} className="text-gray-400 hover:text-red-500">{ICONS.trash}</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {showAiModal && selectedLead && (
        <AiDraftModal
          lead={selectedLead}
          contactMethod={contactMethod}
          onClose={handleCloseModals}
        />
      )}
      {showLeadModal && (
        <LeadModal
          isOpen={showLeadModal}
          onClose={handleCloseModals}
          leadToEdit={leadToEdit}
        />
      )}
    </>
  );
};

export default Leads;
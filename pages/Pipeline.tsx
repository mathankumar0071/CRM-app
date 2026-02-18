import React, { useState } from 'react';
import { useCrm } from '../hooks/useCrm';
import { LeadStatus } from '../types';
import Card from '../components/ui/Card';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';

// Droppable Column Component
interface PipelineColumnProps {
  stage: string;
  count: number;
  children: React.ReactNode;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage, count, children }) => {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div ref={setNodeRef} className="bg-slate-100 p-3 rounded-lg flex flex-col min-h-[500px]">
      <h2 className="font-semibold mb-3 text-gray-700 flex justify-between items-center text-sm px-1">
        <span>{stage}</span>
        <span className="text-sm font-medium text-gray-500 bg-slate-200 rounded-full px-2 py-0.5">{count}</span>
      </h2>
      <div className="space-y-3 flex-1 p-1">
        {children}
      </div>
    </div>
  );
};

// Draggable Lead Card Component
interface DraggableLeadCardProps {
  lead: any;
  user: any;
}

const DraggableLeadCard: React.FC<DraggableLeadCardProps> = ({ lead, user }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className={`p-0 shadow-sm hover:shadow-lg transition-shadow bg-white ${isDragging ? 'rotate-3 cursor-grabbing' : 'cursor-grab'}`}>
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-sm text-gray-800">{lead.name}</h3>
            {lead.deal_value && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                ₹{lead.deal_value.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">{lead.purpose}</p>
          {user && (
            <div className="flex items-center gap-2 mt-3">
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
              <p className="text-xs text-gray-500">{user.name}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


const Pipeline: React.FC = () => {
  const { leads, settings, users, updateLeadStatus } = useCrm();
  const [activeLead, setActiveLead] = useState<any | null>(null);

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => lead.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveLead(event.active.data.current?.lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;
    const currentLead = leads.find(l => l.id === leadId);

    if (currentLead && currentLead.status !== newStatus) {
      updateLeadStatus(leadId, newStatus);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales Pipeline</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 auto-rows-fr min-h-[70vh]">
          {settings.pipeline_stages.map(stage => {
            const leadsInStage = getLeadsByStatus(stage);
            return (
              <PipelineColumn key={stage} stage={stage} count={leadsInStage.length}>
                {leadsInStage.map(lead => {
                  const assignedUser = users.find(u => u.id === lead.assigned_to);
                  return <DraggableLeadCard key={lead.id} lead={lead} user={assignedUser} />;
                })}
              </PipelineColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeLead ? (
            <Card className="p-0 shadow-lg bg-white opacity-80 rotate-3">
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-gray-800">{activeLead.name}</h3>
                  {activeLead.deal_value && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      ₹{activeLead.deal_value.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{activeLead.purpose}</p>
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Pipeline;
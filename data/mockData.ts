import { User, Lead, Task, Activity, Settings } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@dronetribes.com', phone: '123-456-7890', role: 'Admin', avatar: `https://i.pravatar.cc/150?u=u1` },
  { id: 'u2', name: 'Maria Garcia', email: 'maria@dronetribes.com', phone: '234-567-8901', role: 'User', avatar: `https://i.pravatar.cc/150?u=u2` },
  { id: 'u3', name: 'James Smith', email: 'james@dronetribes.com', phone: '345-678-9012', role: 'User', avatar: `https://i.pravatar.cc/150?u=u3` },
  { id: 'u4', name: 'Emily White', email: 'emily@dronetribes.com', phone: '456-789-0123', role: 'User', avatar: `https://i.pravatar.cc/150?u=u4` },
  { id: 'u5', name: 'David Brown', email: 'david@dronetribes.com', phone: '567-890-1234', role: 'User', avatar: `https://i.pravatar.cc/150?u=u5` },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Innovate Corp', email: 'contact@innovate.com', phone: '555-0101', source: 'Website', status: 'New', assigned_to: 'u1', purpose: 'Agricultural Survey Drone', notes: 'Interested in bulk pricing.', last_contacted: '2023-10-10T10:00:00Z', created_at: '2024-05-15T10:00:00Z' },
  { id: 'l2', name: 'Tech Solutions Ltd', email: 'info@techltd.com', phone: '555-0102', source: 'Referral', status: 'Contacted', assigned_to: 'u2', purpose: 'Long-range Delivery Drone', notes: 'Scheduled a call for next week.', last_contacted: '2023-10-12T14:30:00Z', created_at: '2024-05-20T14:30:00Z' },
  { id: 'l3', name: 'Global Media', email: 'press@globalmedia.net', phone: '555-0103', source: 'Cold Call', status: 'Proposal', assigned_to: 'u1', purpose: '4K Cinematography Drone', notes: 'Sent proposal, awaiting feedback.', last_contacted: '2023-10-11T11:00:00Z', created_at: '2024-06-01T11:00:00Z' },
  { id: 'l4', name: 'Real Estate Vision', email: 're@vision.com', phone: '555-0104', source: 'Website', status: 'Negotiation', assigned_to: 'u3', purpose: 'Property Photography Drone', notes: 'Negotiating a 3-drone package.', last_contacted: '2023-10-13T09:00:00Z', created_at: '2024-06-10T09:00:00Z' },
  { id: 'l5', name: 'Logistics Pro', email: 'ops@logisticspro.com', phone: '555-0105', source: 'Trade Show', status: 'Won', assigned_to: 'u2', purpose: 'Warehouse Inventory Drone', notes: 'Deal closed, onboarding scheduled.', last_contacted: '2023-10-09T16:00:00Z', created_at: '2024-07-05T16:00:00Z' },
  { id: 'l6', name: 'City Surveyors', email: 'contact@citysurvey.org', phone: '555-0106', source: 'Website', status: 'Lost', assigned_to: 'u3', purpose: 'Mapping Drone', notes: 'Went with a competitor due to budget constraints.', last_contacted: '2023-10-05T12:00:00Z', created_at: '2024-07-12T12:00:00Z' },
  { id: 'l7', name: 'AgriFuture', email: 'info@agrifuture.com', phone: '555-0107', source: 'Partner', status: 'New', assigned_to: 'u1', purpose: 'Crop-spraying Drone', notes: 'Initial inquiry about custom payloads.', last_contacted: '2023-10-14T10:00:00Z', created_at: '2024-07-18T10:00:00Z' },
  { id: 'l8', name: 'Urban Deliveries', email: 'contact@urbandelivery.io', phone: '555-0108', source: 'Referral', status: 'Contacted', assigned_to: 'u2', purpose: 'Package Delivery Drone', notes: 'Discussing pilot program for downtown area.', last_contacted: '2023-10-15T11:00:00Z', created_at: '2024-06-25T11:00:00Z' },
  { id: 'l9', name: 'Coast Guard Rescue', email: 'sar@coastguard.gov', phone: '555-0109', source: 'Partner', status: 'Proposal', assigned_to: 'u4', purpose: 'Search and Rescue Drone', notes: 'Requires thermal imaging camera.', last_contacted: '2023-10-16T15:00:00Z', created_at: '2024-07-22T15:00:00Z' },
  { id: 'l10', name: 'Windfarm Inspections', email: 'maintenance@windfarm.com', phone: '555-0110', source: 'Cold Call', status: 'New', assigned_to: 'u5', purpose: 'Turbine Inspection Drone', notes: 'Looking for automated flight paths.', last_contacted: '2023-10-17T09:30:00Z', created_at: '2024-07-28T09:30:00Z' },
  { id: 'l11', name: 'Movie Magic Studios', email: 'vfx@moviemagic.com', phone: '555-0111', source: 'Trade Show', status: 'Contacted', assigned_to: 'u1', purpose: 'Heavy-lift Cinema Drone', notes: 'Needs to carry ARRI Alexa camera.', last_contacted: '2023-10-18T13:00:00Z', created_at: '2024-08-01T13:00:00Z' },
  { id: 'l12', name: 'Powerline Services', email: 'grid@powerline.com', phone: '555-0112', source: 'Website', status: 'Negotiation', assigned_to: 'u4', purpose: 'Powerline Inspection Drone', notes: 'Discussing multi-year service contract.', last_contacted: '2023-10-19T10:00:00Z', created_at: '2024-08-05T10:00:00Z' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Follow up with Innovate Corp', lead_id: 'l1', assigned_to: 'u1', due_date: '2024-10-18', priority: 'High', status: 'Pending' },
  { id: 't2', title: 'Prepare proposal for Tech Solutions', lead_id: 'l2', assigned_to: 'u2', due_date: '2024-10-19', priority: 'Medium', status: 'Pending' },
  { id: 't3', title: 'Check in with Global Media', lead_id: 'l3', assigned_to: 'u1', due_date: '2024-10-17', priority: 'Low', status: 'Pending' },
  { id: 't4', title: 'Finalize contract with Real Estate Vision', lead_id: 'l4', assigned_to: 'u3', due_date: '2024-10-20', priority: 'High', status: 'Pending' },
  { id: 't5', title: 'Onboarding call with Logistics Pro', lead_id: 'l5', assigned_to: 'u2', due_date: '2024-10-15', priority: 'Medium', status: 'Completed' },
  { id: 't6', title: 'Schedule demo for Coast Guard Rescue', lead_id: 'l9', assigned_to: 'u4', due_date: '2024-10-22', priority: 'High', status: 'Pending' },
  { id: 't7', title: 'Send info packet to Windfarm Inspections', lead_id: 'l10', assigned_to: 'u5', due_date: '2024-10-21', priority: 'Medium', status: 'Pending' },
  { id: 't8', title: 'Follow up with Movie Magic Studios', lead_id: 'l11', assigned_to: 'u1', due_date: '2024-10-24', priority: 'Medium', status: 'Pending' },
  { id: 't9', title: 'Review service contract for Powerline Services', lead_id: 'l12', assigned_to: 'u4', due_date: '2024-10-25', priority: 'High', status: 'Pending' },
  { id: 't10', title: 'Research custom payloads for AgriFuture', lead_id: 'l7', assigned_to: 'u1', due_date: '2024-10-23', priority: 'Low', status: 'Completed' },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', user_id: 'u1', action: 'added a new lead: Innovate Corp', timestamp: '2023-10-10T10:00:00Z' },
  { id: 'a2', user_id: 'u2', action: 'updated lead status for Tech Solutions Ltd to Contacted', timestamp: '2023-10-12T14:30:00Z' },
  { id: 'a3', user_id: 'u3', action: 'completed task: Initial research for City Surveyors', timestamp: '2023-10-12T15:00:00Z' },
  { id: 'a4', user_id: 'u1', action: 'sent a proposal to Global Media', timestamp: '2023-10-11T11:00:00Z' },
  { id: 'a5', user_id: 'u2', action: 'closed the deal with Logistics Pro', timestamp: '2023-10-09T16:00:00Z' },
];

export const MOCK_SETTINGS: Settings = {
    companyName: 'Dronetribes',
    lead_sources: ['Website', 'Referral', 'Cold Call', 'Trade Show', 'Partner'],
    pipeline_stages: ['New', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'],
};
export type UserRole = 'Admin' | 'User';
export type LeadStatus = 'New' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type TaskStatus = 'Pending' | 'On Process' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type ToastType = 'success' | 'error' | 'info';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  assigned_to: string; // user id
  purpose: string;
  notes: string;
  last_contacted: string; // ISO date string
  created_at: string; // ISO date string
  deal_value?: number;
}

export interface Task {
  id: string;
  title: string;
  lead_id: string; // lead id
  assigned_to: string; // user id
  due_date: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Activity {
  id: string;
  user_id: string; // user id
  action: string;
  timestamp: string; // ISO date string
}

export interface Settings {
  companyName: string;
  lead_sources: string[];
  pipeline_stages: LeadStatus[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
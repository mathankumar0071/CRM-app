import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Lead, Task, Activity, Settings, LeadStatus, TaskStatus } from '../types';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

type LeadData = Omit<Lead, 'id' | 'last_contacted' | 'created_at'>;
type TaskData = Omit<Task, 'id'>;
type UserData = Omit<User, 'id'>;

interface DataContextProps {
  currentUser: User;
  users: User[];
  leads: Lead[];
  tasks: Task[];
  activities: Activity[];
  settings: Settings;
  getLeadById: (id: string) => Lead | undefined;
  getUserById: (id: string) => User | undefined;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addLead: (lead: LeadData) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  addTask: (task: TaskData) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addUser: (user: UserData) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  updateCurrentUser: (user: User) => void;
  updateSettings: (settings: Settings) => void;
}

export const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Dronetribes',
    lead_sources: ['Website', 'Referral', 'Cold Call', 'Trade Show', 'Partner'],
    pipeline_stages: ['New', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'],
  });

  // Default dummy user to prevent crashes before load
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'loading',
    name: 'Loading...',
    email: '',
    phone: '',
    role: 'User',
    avatar: ''
  });

  useEffect(() => {
    if (authUser) {
      fetchData();
      fetchCurrentUser();
    }
  }, [authUser]);

  const fetchData = async () => {
    console.log("Fetching data...");

    const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (leadsError) console.error("Error fetching leads:", leadsError);
    if (leadsData) setLeads(leadsData as unknown as Lead[]);

    const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (tasksError) console.error("Error fetching tasks:", tasksError);
    if (tasksData) setTasks(tasksData as unknown as Task[]);

    const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
    if (usersError) {
      console.error("Error fetching profiles:", usersError);
    } else {
      console.log("Fetched profiles:", usersData);
      if (usersData) setUsers(usersData as unknown as User[]);
    }

    const { data: activitiesData, error: activitiesError } = await supabase.from('activities').select('*').order('timestamp', { ascending: false }).limit(20);
    if (activitiesError) console.error("Error fetching activities:", activitiesError);
    if (activitiesData) setActivities(activitiesData as unknown as Activity[]);
  };

  const fetchCurrentUser = async () => {
    if (!authUser) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();

    if (data) {
      setCurrentUser(data as unknown as User);
    } else if (error) {
      // If profile doesn't exist (should be handled by trigger, but just in case)
      console.error('Error fetching profile:', error);
    }
  }

  const getLeadById = (id: string) => leads.find(lead => lead.id === id);
  const getUserById = (id: string) => users.find(user => user.id === id);

  const addActivity = async (action: string, userId = currentUser.id) => {
    if (userId === 'loading') return;
    const newActivity = {
      user_id: userId,
      action,
      timestamp: new Date().toISOString()
    };

    // Optimistic update
    const optimisticActivity = { ...newActivity, id: `temp-${Date.now()}` } as Activity;
    setActivities(prev => [optimisticActivity, ...prev].slice(0, 20));

    const { data, error } = await supabase.from('activities').insert(newActivity).select().single();
    if (data) {
      setActivities(prev => [data as unknown as Activity, ...prev.filter(a => a.id !== optimisticActivity.id)].slice(0, 20));
    }
  }

  // Lead Actions
  const addLead = async (leadData: LeadData) => {
    const newLead = {
      ...leadData,
      assigned_to: currentUser.id, // Default to current user if not specified? Or handle in UI. 
      // leadData has assigned_to? Check type. Yes, LeadData omits id, last_contacted, created_at. So it has assigned_to.
      last_contacted: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Optimistic
    const optimisticLead = { ...newLead, id: `temp-${Date.now()}` } as Lead;
    setLeads(prev => [optimisticLead, ...prev]);
    addActivity(`added a new lead: ${newLead.name}`);

    const { data } = await supabase.from('leads').insert(newLead).select().single();
    if (data) {
      setLeads(prev => prev.map(l => l.id === optimisticLead.id ? (data as unknown as Lead) : l));
    }
  };

  const updateLead = async (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    addActivity(`updated lead: ${updatedLead.name}`);
    const { error } = await supabase.from('leads').update(updatedLead).eq('id', updatedLead.id);
    if (error) {
      console.error("Error updating lead:", error);
    }
  }

  const deleteLead = async (leadId: string) => {
    const leadToDelete = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (leadToDelete) {
      addActivity(`deleted lead: ${leadToDelete.name}`);
      await supabase.from('leads').delete().eq('id', leadId);
    }
  }

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );
    const lead = getLeadById(leadId);
    if (lead) {
      addActivity(`updated lead status for ${lead.name} to ${status}`);
      await supabase.from('leads').update({ status }).eq('id', leadId);
    }
  };

  // Task Actions
  const addTask = async (taskData: TaskData) => {
    const newTask = {
      ...taskData,
      created_at: new Date().toISOString()
    };

    const optimisticTask = { ...newTask, id: `temp-${Date.now()}` } as Task;
    setTasks(prev => [optimisticTask, ...prev]);
    addActivity(`created a new task: ${newTask.title}`);

    const { data } = await supabase.from('tasks').insert(newTask).select().single();
    if (data) {
      setTasks(prev => prev.map(t => t.id === optimisticTask.id ? (data as unknown as Task) : t));
    }
  }

  const updateTask = async (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    addActivity(`updated task: "${updatedTask.title}"`);
    await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id);
  }

  const deleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (taskToDelete) {
      addActivity(`deleted task: "${taskToDelete.title}"`);
      await supabase.from('tasks').delete().eq('id', taskId);
    }
  }

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    );
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addActivity(`updated task status for "${task.title}" to ${status}`);
      await supabase.from('tasks').update({ status }).eq('id', taskId);
    }
  };

  // User Actions
  const addUser = async (userData: any) => {
    // userData contains password here

    // Call the RPC function to create the user in Auth and Profile
    const { data: newUserId, error } = await supabase.rpc('create_user_with_password', {
      _email: userData.email,
      _password: userData.password,
      _name: userData.name,
      _role: userData.role
    });

    if (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user: " + error.message);
      return;
    }

    // After success, we can add to local state safely
    const newUser = {
      ...userData,
      id: newUserId,
      avatar: userData.avatar || null // Use null to avoid empty string warning
    };
    // Remove password before adding to state
    delete newUser.password;

    setUsers(prev => [newUser as User, ...prev]);
    addActivity(`added a new user: ${newUser.name}`);
  }

  const updateUser = async (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Update currentUser if it's the same person
    if (updatedUser.id === currentUser.id) {
      // Keep local state in sync
      const newCurrentUser = { ...currentUser, ...updatedUser };
      setCurrentUser(newCurrentUser);
    }

    addActivity(`updated user profile: ${updatedUser.name}`);

    const { error } = await supabase.from('profiles').update(updatedUser).eq('id', updatedUser.id);
    if (error) {
      console.error("Error updating user:", error);
      // Revert? Or just alert?
    }
  }

  const deleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (userToDelete) {
      addActivity(`deleted user: ${userToDelete.name}`);
      // await supabase.from('profiles').delete().eq('id', userId); // admin only usually
    }
  }

  // Current User & Settings
  const updateCurrentUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    addActivity(`updated their profile information`);
    await supabase.from('profiles').update(updatedUser).eq('id', updatedUser.id);
  }

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    addActivity(`updated system settings`);
    // Save settings to DB? Maybe later.
  }

  return (
    <DataContext.Provider value={{ currentUser, users, leads, tasks, activities, settings, getLeadById, getUserById, updateLeadStatus, updateTaskStatus, addLead, updateLead, deleteLead, addTask, updateTask, deleteTask, addUser, updateUser, deleteUser, updateCurrentUser, updateSettings }}>
      {children}
    </DataContext.Provider>
  );
};
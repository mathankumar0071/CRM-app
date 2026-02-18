import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCrm } from '../hooks/useCrm';
import { useToast } from '../hooks/useToast';
import { Settings as SettingsType } from '../types';
import { ICONS } from '../constants';


const Settings: React.FC = () => {
  const { settings, updateSettings } = useCrm();
  const { addToast } = useToast();
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const [newSource, setNewSource] = useState('');
  const [newStage, setNewStage] = useState('');

  const handleSave = () => {
    updateSettings(localSettings);
    addToast('Settings saved successfully!', 'success');
  };

  const addLeadSource = () => {
    if (newSource && !localSettings.lead_sources.includes(newSource)) {
        setLocalSettings(prev => ({...prev, lead_sources: [...prev.lead_sources, newSource]}));
        setNewSource('');
    }
  };

  const removeLeadSource = (sourceToRemove: string) => {
    setLocalSettings(prev => ({...prev, lead_sources: prev.lead_sources.filter(s => s !== sourceToRemove)}));
  };
  
  const addPipelineStage = () => {
      // @ts-ignore - LeadStatus type is strict, but for customization we allow any string
    if (newStage && !localSettings.pipeline_stages.includes(newStage)) {
         // @ts-ignore
        setLocalSettings(prev => ({...prev, pipeline_stages: [...prev.pipeline_stages, newStage]}));
        setNewStage('');
    }
  };

  const removePipelineStage = (stageToRemove: string) => {
    // @ts-ignore
    setLocalSettings(prev => ({...prev, pipeline_stages: prev.pipeline_stages.filter(s => s !== stageToRemove)}));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      
      <Card title="Company Profile">
        <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input 
                type="text" 
                value={localSettings.companyName}
                onChange={(e) => setLocalSettings(p => ({...p, companyName: e.target.value}))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
      </Card>

      <Card title="Manage Lead Sources">
        <div className="space-y-3">
          {localSettings.lead_sources.map(source => (
            <div key={source} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <span>{source}</span>
              <button onClick={() => removeLeadSource(source)} className="text-gray-400 hover:text-red-500">
                <div className="w-5 h-5">{ICONS.trash}</div>
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
            <input 
                type="text" 
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="Add new source..."
                className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <Button variant="secondary" onClick={addLeadSource}>Add</Button>
        </div>
      </Card>

      <Card title="Manage Pipeline Stages">
         <div className="space-y-3">
          {localSettings.pipeline_stages.map(stage => (
            <div key={stage} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <span>{stage}</span>
              <button onClick={() => removePipelineStage(stage)} className="text-gray-400 hover:text-red-500">
                <div className="w-5 h-5">{ICONS.trash}</div>
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
            <input 
                type="text" 
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                placeholder="Add new stage..."
                className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <Button variant="secondary" onClick={addPipelineStage}>Add</Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Lead } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface AiDraftModalProps {
  lead: Lead;
  contactMethod: 'Email' | 'WhatsApp' | 'General';
  onClose: () => void;
}

const AiDraftModal: React.FC<AiDraftModalProps> = ({ lead, contactMethod, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setError('');
    setIsLoading(true);
    setDraft('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("AI service is not configured (VITE_GEMINI_API_KEY missing).");
      }
      const ai = new GoogleGenAI({ apiKey });

      const fullPrompt = `You are a sales assistant for DRONETRIBES, a company specializing in high-tech drones. A lead named "${lead.name}" is interested in a "${lead.purpose}". Their last interaction notes are: "${lead.notes}". 
      
      Based on this, please draft a professional and friendly ${contactMethod} message with the following goal: "${prompt}".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      setDraft(response.text.trim());
    } catch (err) {
      console.error("Gemini API error:", err);
      setError('An error occurred while communicating with the AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card title={`AI ${contactMethod} Assistant`} className="w-full max-w-2xl bg-white">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              Generating a message for <span className="font-semibold">{lead.name}</span>.
            </p>
            <label className="block text-sm font-medium mt-2">What is the goal of this message?</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Follow up on our last call and ask for a good time to schedule a demo next week.'"
              className="w-full mt-1 p-2 border rounded"
              rows={3}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : `Generate ${contactMethod} Draft`}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {draft && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border">
              <h3 className="font-semibold mb-2">Generated Draft:</h3>
              <textarea
                className="w-full p-2 border rounded bg-white text-gray-700 h-32"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="space-x-2">
                  {contactMethod === 'Email' && (
                    <Button onClick={() => window.open(`mailto:${lead.email}?body=${encodeURIComponent(draft)}`)}>
                      Send Email
                    </Button>
                  )}
                  {contactMethod === 'WhatsApp' && (
                    <Button onClick={() => window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(draft)}`, '_blank')}>
                      Send WhatsApp
                    </Button>
                  )}
                </div>
                <Button onClick={handleCopyToClipboard} variant="secondary" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">The AI is thinking...</span>
            </div>
          )}

        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Close</Button>
        </div>
      </Card>
    </div>
  );
};

export default AiDraftModal;

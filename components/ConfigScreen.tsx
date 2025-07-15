import React, { useState, useEffect } from 'react';
import { ApiConfig, ApiProvider, OPENROUTER_MODELS } from '../types';
import { CogIcon } from './icons';

interface ConfigScreenProps {
  onConfigured: (config: ApiConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onConfigured }) => {
  const [provider, setProvider] = useState<ApiProvider>(ApiProvider.GEMINI);
  const [geminiKey, setGeminiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [openRouterModel, setOpenRouterModel] = useState(OPENROUTER_MODELS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (provider === ApiProvider.GEMINI && !geminiKey.trim()) {
      setError('Gemini API Key is required.');
      return;
    }
    if (provider === ApiProvider.OPENROUTER && !openRouterKey.trim()) {
      setError('OpenRouter API Key is required.');
      return;
    }

    onConfigured({
      provider,
      geminiKey,
      openRouterKey,
      openRouterModel,
    });
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-surface rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center justify-center gap-3">
            <CogIcon className="w-8 h-8 text-sky-400"/>
            <span>Configuration</span>
          </h1>
          <p className="text-brand-text-secondary mt-2">
            Set your API keys to begin.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">AI Provider</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setProvider(ApiProvider.GEMINI)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${provider === ApiProvider.GEMINI ? 'bg-sky-600 text-white ring-2 ring-sky-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                Google Gemini
              </button>
              <button type="button" onClick={() => setProvider(ApiProvider.OPENROUTER)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${provider === ApiProvider.OPENROUTER ? 'bg-sky-600 text-white ring-2 ring-sky-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                OpenRouter
              </button>
            </div>
          </div>

          {provider === ApiProvider.GEMINI && (
            <div className="animate-fade-in">
              <label htmlFor="gemini-key" className="block text-sm font-medium text-brand-text-secondary mb-2">Gemini API Key</label>
              <input
                id="gemini-key"
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full p-3 bg-slate-900 border-2 border-brand-secondary rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>
          )}

          {provider === ApiProvider.OPENROUTER && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="openrouter-key" className="block text-sm font-medium text-brand-text-secondary mb-2">OpenRouter API Key</label>
                <input
                  id="openrouter-key"
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="Enter your OpenRouter API key"
                  className="w-full p-3 bg-slate-900 border-2 border-brand-secondary rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
               <div>
                <label htmlFor="openrouter-model" className="block text-sm font-medium text-brand-text-secondary mb-2">Select a Free Model</label>
                <select 
                  id="openrouter-model"
                  value={openRouterModel}
                  onChange={(e) => setOpenRouterModel(e.target.value)}
                  className="w-full p-3 bg-slate-900 border-2 border-brand-secondary rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                >
                  {OPENROUTER_MODELS.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <div>
            <button type="submit" className="w-full mt-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-slate-600 transition-colors transform hover:scale-105">
              Save & Start Researching
            </button>
          </div>
        </form>
      </div>
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ConfigScreen;

import React, { useState, useEffect, useCallback } from 'react';
import { ApiConfig } from './types';
import ConfigScreen from './components/ConfigScreen';
import ResearchApp from './ResearchApp';
import { Spinner } from './components/Spinner';

const CONFIG_STORAGE_KEY = 'ai-researcher-config';

const App: React.FC = () => {
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }
    } catch (error) {
      console.error("Failed to load config from localStorage", error);
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfigured = useCallback((newConfig: ApiConfig) => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error("Failed to save config to localStorage", error);
    }
  }, []);
  
  const handleResetConfig = useCallback(() => {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    setConfig(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {config ? (
        <ResearchApp config={config} onResetConfig={handleResetConfig} />
      ) : (
        <ConfigScreen onConfigured={handleConfigured} />
      )}
    </>
  );
};

export default App;

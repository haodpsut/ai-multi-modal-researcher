import React, { useState, useCallback } from 'react';
import { ApiConfig, ResearchState, ResearchStep, Source } from './types';
import { generateResearchPlan, conductResearch } from './services/geminiService';
import { QueryForm } from './components/QueryForm';
import { PlanDisplay } from './components/PlanDisplay';
import { ReportDisplay } from './components/ReportDisplay';
import { BrainCircuitIcon, FileTextIcon, CogIcon } from './components/icons';

interface ResearchAppProps {
  config: ApiConfig;
  onResetConfig: () => void;
}

const ResearchApp: React.FC<ResearchAppProps> = ({ config, onResetConfig }) => {
  const [query, setQuery] = useState<string>('');
  const [researchState, setResearchState] = useState<ResearchState>({
    step: ResearchStep.IDLE,
    plan: null,
    report: null,
    sources: [],
    error: null,
  });

  const handleResearch = useCallback(async () => {
    if (!query.trim()) {
      setResearchState({ ...researchState, error: 'Please enter a research topic.' });
      return;
    }

    setResearchState({
      step: ResearchStep.PLANNING,
      plan: null,
      report: null,
      sources: [],
      error: null,
    });

    try {
      const plan = await generateResearchPlan(query, config);
      setResearchState(prevState => ({ ...prevState, plan, step: ResearchStep.RESEARCHING }));

      const researchResult = await conductResearch(query, config);
      setResearchState(prevState => ({
        ...prevState,
        report: researchResult.report,
        sources: researchResult.sources,
        step: ResearchStep.DONE,
      }));
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setResearchState(prevState => ({ ...prevState, error: `Failed during research: ${errorMessage}`, step: ResearchStep.IDLE }));
    }
  }, [query, config]);

  return (
    <div className="min-h-screen bg-brand-background font-sans text-brand-text-primary">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            AI Multi-Modal Researcher
          </h1>
          <p className="text-brand-text-secondary mt-2 text-lg">
            Your intelligent assistant for comprehensive research synthesis.
          </p>
          <button 
            onClick={onResetConfig} 
            className="absolute top-0 right-0 p-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-200"
            aria-label="Reset Configuration"
            title="Reset Configuration"
          >
            <CogIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="max-w-3xl mx-auto">
          <QueryForm
            query={query}
            setQuery={setQuery}
            onResearch={handleResearch}
            isLoading={researchState.step === ResearchStep.PLANNING || researchState.step === ResearchStep.RESEARCHING}
          />
          {researchState.error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <p><strong>Error:</strong> {researchState.error}</p>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
             <div className="bg-brand-surface rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="flex items-center text-2xl font-semibold mb-4 text-sky-400">
                  <BrainCircuitIcon className="w-7 h-7 mr-3" />
                  Research Plan
                </h2>
                <PlanDisplay plan={researchState.plan} isLoading={researchState.step === ResearchStep.PLANNING} />
             </div>
          </div>

          <div className="lg:col-span-3">
             <div className="bg-brand-surface rounded-xl shadow-lg p-6">
                <h2 className="flex items-center text-2xl font-semibold mb-4 text-sky-400">
                  <FileTextIcon className="w-7 h-7 mr-3" />
                  Synthesized Report
                </h2>
               <ReportDisplay
                  report={researchState.report}
                  sources={researchState.sources}
                  isLoading={researchState.step === ResearchStep.RESEARCHING}
                />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResearchApp;

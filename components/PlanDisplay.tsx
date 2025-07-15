
import React from 'react';
import { Spinner } from './Spinner';

interface PlanDisplayProps {
  plan: string | null;
  isLoading: boolean;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-brand-text-secondary">
        <Spinner />
        <p className="mt-3">Generating research plan...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center text-brand-text-secondary py-10">
        <p>The research plan will appear here once you start.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert prose-p:text-brand-text-secondary prose-li:text-brand-text-secondary whitespace-pre-wrap">
       {plan.split('\n').map((line, index) => {
         if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
           return <li key={index} className="ml-4 list-none before:content-['▸'] before:mr-2 before:text-sky-400">{line.substring(2)}</li>;
         }
         return <p key={index}>{line}</p>
       })}
    </div>
  );
};

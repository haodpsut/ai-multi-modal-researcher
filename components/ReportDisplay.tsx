
import React from 'react';
import { Source } from '../types';
import { Spinner } from './Spinner';
import { LinkIcon } from './icons';

interface ReportDisplayProps {
  report: string | null;
  sources: Source[];
  isLoading: boolean;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, sources, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-brand-text-secondary">
        <Spinner />
        <p className="mt-3">Conducting research and synthesizing report...</p>
        <p className="text-sm mt-1">This may take a moment.</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-brand-text-secondary py-10">
        <p>The final report will appear here once research is complete.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="prose prose-invert max-w-none prose-p:text-brand-text-secondary prose-headings:text-brand-text-primary prose-strong:text-sky-300 prose-a:text-sky-400 whitespace-pre-wrap">
        {report}
      </div>

      {sources.length > 0 && (
        <div className="mt-10">
          <h3 className="flex items-center text-xl font-semibold mb-4 text-sky-400">
            <LinkIcon className="w-5 h-5 mr-3" />
            Sources
          </h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-200"
                >
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

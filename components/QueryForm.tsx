
import React from 'react';
import { SearchIcon } from './icons';
import { Spinner } from './Spinner';

interface QueryFormProps {
  query: string;
  setQuery: (query: string) => void;
  onResearch: () => void;
  isLoading: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ query, setQuery, onResearch, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your research topic, e.g., 'The future of renewable energy in Southeast Asia'"
        className="w-full p-4 bg-brand-surface border-2 border-brand-secondary rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none h-28"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Researching...</span>
          </>
        ) : (
          <>
            <SearchIcon className="w-5 h-5" />
            <span>Start Research</span>
          </>
        )}
      </button>
    </form>
  );
};

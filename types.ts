export enum ResearchStep {
  IDLE,
  PLANNING,
  RESEARCHING,
  DONE,
}

export interface Source {
  uri: string;
  title: string;
}

export interface ResearchState {
  step: ResearchStep;
  plan: string | null;
  report: string | null;
  sources: Source[];
  error: string | null;
}

export enum ApiProvider {
  GEMINI = 'gemini',
  OPENROUTER = 'openrouter',
}

export const OPENROUTER_MODELS = [
  "google/gemma-7b-it",
  "mistralai/mistral-7b-instruct-v0.2",
  "nousresearch/nous-hermes-2-mistral-7b-dpo",
  "openchat/openchat-7b",
  "huggingfaceh4/zephyr-7b-beta",
];

export interface ApiConfig {
  provider: ApiProvider;
  geminiKey: string;
  openRouterKey: string;
  openRouterModel: string;
}

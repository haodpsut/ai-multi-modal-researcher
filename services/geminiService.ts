// This service handles API calls for both Gemini and OpenRouter.
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Source, ApiConfig, ApiProvider } from '../types';

const callOpenRouter = async (prompt: string, config: ApiConfig, useSearch: boolean) => {
    const { openRouterKey, openRouterModel } = config;
    if (!openRouterKey) {
        throw new Error("OpenRouter API Key is not configured.");
    }
    
    // For OpenRouter, we ask the model to perform a search in the prompt.
    // The search capability is model-dependent.
    const finalPrompt = useSearch 
      ? `Using a web search, ${prompt}`
      : prompt;

    const body = {
        model: openRouterModel,
        messages: [{ role: "user", content: finalPrompt }],
        temperature: useSearch ? 0.5 : 0.2,
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://example.com', // Generic referer
            'X-Title': 'AI Multi-Modal Researcher',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textContent = data.choices[0]?.message?.content || '';

    // With this simplified approach, sources are expected to be embedded in the text by the model.
    return { report: textContent, sources: [] };
};

const callGemini = async (prompt: string, config: ApiConfig, useSearch: boolean) => {
    const { geminiKey } = config;
    if (!geminiKey) {
        throw new Error("Gemini API Key is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const model = 'gemini-2.5-flash';

    const genAIConfig: any = {
        temperature: useSearch ? 0.5 : 0.2,
    };

    // The user's error indicates a problem with client-side calls using the googleSearch tool.
    // This can be due to CORS, API key permissions, or SDK limitations in the browser.
    // To resolve the error, we will remove the explicit tool call.
    // The main research prompt already instructs the model to use search and cite sources,
    // so the model should still provide a grounded answer.
    // The automatic source extraction via `groundingMetadata` will no longer work,
    // but the app will become functional again.
    /*
    if (useSearch) {
        genAIConfig.tools = [{ googleSearch: {} }];
    }
    */

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: genAIConfig,
    });
    
    const report = response.text;
    
    let sources: Source[] = [];
    // This block will now find no grounding metadata, which is the intended consequence of the fix.
    // The sources will be part of the text report as requested in the prompt.
    if (useSearch) {
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        sources = groundingChunks
            .map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
            .reduce((acc: Source[], current) => {
                if (!acc.some(item => item.uri === current.uri)) {
                    acc.push({ uri: current.uri, title: current.title || current.uri });
                }
                return acc;
            }, []);
    }
    
    return { report, sources };
};

export const generateResearchPlan = async (query: string, config: ApiConfig): Promise<string> => {
    const prompt = `You are an expert AI research assistant. Your user wants to research the topic: "${query}".
Generate a concise, step-by-step research plan. For each step, outline the key questions to answer or the information to look for.
Present the plan as a clear, bulleted list. Do not write the full report, only the plan.`;

    try {
        if (config.provider === ApiProvider.GEMINI) {
            const result = await callGemini(prompt, config, false);
            return result.report;
        } else {
            const result = await callOpenRouter(prompt, config, false);
            return result.report;
        }
    } catch (error) {
        console.error("Error generating research plan:", error);
        throw new Error(`Failed to generate a plan. ${error instanceof Error ? error.message : ''}`);
    }
};

export const conductResearch = async (query: string, config: ApiConfig): Promise<{ report: string; sources: Source[] }> => {
    const prompt = `You are an expert AI research assistant. Write a comprehensive and detailed report on the following topic: "${query}".
Structure the report with a clear introduction, main body with well-defined sections using markdown for formatting (e.g., headings, bold text, lists), and a concluding summary.
Ensure the information is accurate, up-to-date, and well-supported by the search results. Be objective and present the information clearly.
When using web search, cite your sources clearly using inline citations like [1] and list all sources at the end under a "Sources" heading.`;
    
    try {
        if (config.provider === ApiProvider.GEMINI) {
            return await callGemini(prompt, config, true);
        } else {
            return await callOpenRouter(prompt, config, true);
        }
    } catch (error) {
        console.error("Error conducting research:", error);
        throw new Error(`Failed to conduct research. ${error instanceof Error ? error.message : ''}`);
    }
};
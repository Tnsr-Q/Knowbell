
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { AnalysisResult, DiscussionTurn, PaperSection, PhysicistPersonaId } from '../types';
import { runGraph } from './langgraphService';

// Initialize the Gemini client, assuming API_KEY is in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

// Define the JSON schema for the AnalysisResult to ensure structured output from the model
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    guidelinesTitle: { type: Type.STRING },
    qualityScore: { type: Type.NUMBER, description: "A score from 1 to 5, where 5 is best." },
    violations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Minor', 'Major', 'Critical'] },
        },
        required: ['description', 'severity'],
      },
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    clarificationQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    revisedText: { type: Type.STRING },
  },
  required: [
    'guidelinesTitle',
    'qualityScore',
    'violations',
    'strengths',
    'clarificationQuestions',
    'recommendations',
    'revisedText',
  ],
};


/**
 * Calls the Gemini API to analyze a section of a paper.
 * It uses JSON mode with a schema to get a structured, predictable response.
 * @param text The text of the paper section.
 * @param section The type of the paper section.
 * @param format The target publication format.
 * @returns A promise that resolves to an AnalysisResult.
 */
export const analyzeSection = async (
  text: string,
  section: PaperSection,
  format: string
): Promise<AnalysisResult> => {
  console.log(`Analyzing ${section} for ${format} with Gemini...`);

  const prompt = `
    You are an expert scientific paper reviewer for top-tier physics journals.
    Your task is to analyze the following section of a research paper and provide a structured review.

    **Publication Target:** ${format}
    **Paper Section:** ${section}

    **Input Text:**
    ---
    ${text}
    ---

    **Instructions:**
    1.  **Analyze the text critically** based on the standards of the target publication.
    2.  **Provide a Quality Score** from 1 (poor) to 5 (excellent).
    3.  **Identify Violations:** List specific issues, categorizing their severity as 'Minor', 'Major', or 'Critical'. These should be actionable criticisms.
    4.  **List Strengths:** Identify at least 2-3 key strengths of the text.
    5.  **Pose Clarification Questions:** Ask questions that would help the author clarify ambiguous points.
    6.  **Give Recommendations:** Suggest concrete changes to improve the text.
    7.  **Provide a Revised Text:** Offer a rewritten version of a key paragraph or the full text that implements your most important feedback.
    8.  **Format your entire response as a single JSON object** that adheres to the provided schema. Do not include any markdown formatting or explanatory text outside of the JSON structure.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const jsonText = response.text.trim();
    // The response text is guaranteed by the API to be valid JSON when using responseSchema
    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Error during Gemini API call in analyzeSection:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze section with Gemini. ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
};

/**
 * Generates a round-table discussion by invoking the live LangGraph service.
 * @param text The text to be discussed.
 * @param personas The array of selected physicist persona IDs.
 * @returns A promise that resolves to an array of DiscussionTurn objects.
 */
export const generateDiscussion = async (
  text: string,
  personas: PhysicistPersonaId[]
): Promise<DiscussionTurn[]> => {
  console.log(`Generating discussion via LangGraph with: ${personas.join(', ')}`);
  
  if (personas.length === 0) return [];
  
  // Delegate the core logic to the LangGraph service, which now uses real API calls.
  try {
    const discussion = await runGraph(text, personas);
    return discussion;
  } catch (error) {
     console.error("Error during Gemini API call in generateDiscussion (via runGraph):", error);
     if (error instanceof Error) {
        throw new Error(`Failed to generate discussion. ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating discussion.');
  }
};

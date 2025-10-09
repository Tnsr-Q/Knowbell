import { AnalysisResult, DiscussionTurn, PaperSection, PhysicistPersonaId } from '../types';
import { runGraph } from './langgraphService';

// --- CONFIGURATION (FROM USER PROMPT) ---
// These would be in a .env file in a real application
const CEREBRAS_API_KEY = 'csk-wfrjvv55exhjxmwr2x4wvwjrpxdtw4yn64dn2nmtey6w6hjp';
const DEEPSEEK_API_KEY = 'sk-6727d129077840a99ce39a497389e5e8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com';

// This function simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mocks a call to a powerful backend to analyze a section of a paper.
 * In a real app, this would make an authenticated request to a server that
 * orchestrates calls to DeepSeek (for reasoning) and Cerebras (for high-speed processing).
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
  console.log(`Analyzing ${section} for ${format} with DeepSeek and Cerebras...`);
  console.log(`Text length: ${text.length}`);

  // Simulate API call latency
  await sleep(1500 + Math.random() * 1000);

  // Return realistic mock data
  return {
    guidelinesTitle: `Analysis for ${section} based on ${format} standards`,
    qualityScore: 3 + Math.floor(Math.random() * 2), // Random score 3 or 4
    violations: [
      {
        description: `Clarity of the central argument could be improved in the second paragraph. The transition lacks a clear logical bridge.`,
        severity: 'Major',
      },
      {
        description: `Equation (3) is not properly referenced in the text preceding its introduction. According to ${format} guidelines, all equations must be introduced.`,
        severity: 'Minor',
      },
       {
        description: `The derivation connecting the path integral formalism to the final state is mathematically dense and assumes significant prior knowledge. Consider adding a supplemental appendix.`,
        severity: 'Critical',
      },
    ],
    strengths: [
      'Novelty of the proposed formalism is exceptionally high.',
      'Mathematical rigor in the initial sections is commendable and meets the highest academic standards.',
      'The connection to experimental observables is clearly articulated, which is a significant strength.',
    ],
    clarificationQuestions: [
      'What is the physical interpretation of the boundary term in equation (5)?',
      'Could the regularization scheme be sensitive to the choice of contour in the complex plane?',
    ],
    recommendations: [
        'Restructure the second paragraph to state the conclusion first, then provide the supporting steps.',
        'Add a sentence before Equation (3) such as: "The dynamics are governed by the following relation:".',
        'Elaborate on the physical justification for the choice of gauge fixing.'
    ],
    revisedText: `[REVISED TEXT] \n${text}\n\nThis revised version incorporates feedback focusing on enhancing clarity and adherence to the ${format} style guide. The logical flow has been improved, and equation references are now correctly placed.`
  };
};

/**
 * Generates a round-table discussion by invoking the LangGraph service.
 * This function now acts as a pass-through to the more sophisticated, memory-enabled
 * conversational agent simulation.
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
  
  // Delegate the core logic to the LangGraph service simulation
  const discussion = await runGraph(text, personas);
  return discussion;
};
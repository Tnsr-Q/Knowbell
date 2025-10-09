// --- CORE APPLICATION TYPES ---

export enum PaperSection {
  ABSTRACT = 'Abstract',
  INTRODUCTION = 'Introduction',
  METHODS = 'Methods',
  RESULTS = 'Results',
  CONCLUSION = 'Conclusion',
  FIGURES = 'Figures',
}

export enum PhysicistPersonaId {
  EINSTEIN = 'EINSTEIN',
  FEYNMAN = 'FEYNMAN',
  SCHRODINGER = 'SCHRODINGER',
  DIRAC = 'DIRAC',
  HEISENBERG = 'HEISENBERG',
}

export interface Physicist {
  id: PhysicistPersonaId;
  name: string;
  expertise: string;
  prompt: string;
}

export interface AnalysisViolation {
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
}

export interface AnalysisResult {
  guidelinesTitle: string;
  qualityScore: number;
  violations: AnalysisViolation[];
  strengths: string[];
  clarificationQuestions: string[];
  recommendations: string[];
  revisedText: string;
}

export interface DiscussionTurn {
  personaId: PhysicistPersonaId;
  personaName: string;
  text: string;
}


// --- NEW TYPES FOR AGENTIC SYSTEM ---

/**
 * Represents a potential tool call by an agent.
 * This provides a hook for future expansion with tools like code interpreters or web search.
 */
export interface ToolCall {
  toolName: string;
  args: Record<string, any>;
}

/**
 * The core state object that is passed between nodes in our LangGraph simulation.
 * It contains all the information necessary for the agents to perform their tasks.
 */
export interface AgentState {
  originalText: string;
  personas: PhysicistPersonaId[];
  plan: string;
  discussion: DiscussionTurn[];
  scratchpads: Record<PhysicistPersonaId, string>;
  iteration: number;
  maxIterations: number;
  finalOutput: DiscussionTurn[] | null;
}

/**
 * Represents a structured entry in the mock Mem0.ai client.
 * Metadata allows for sophisticated querying and memory management.
 */
export interface MemoryEntry {
  id: string;
  text: string;
  metadata: {
    sessionId: string;
    timestamp: number;
    type: 'user_input' | 'plan' | 'agent_scratchpad' | 'agent_turn' | 'reflection' | 'knowledge_base';
    agentId?: PhysicistPersonaId;
    [key: string]: any;
  };
}

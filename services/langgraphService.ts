
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { DiscussionTurn, PhysicistPersonaId, AgentState, MemoryEntry } from '../types';
import { PHYSICIST_PERSONAS, WRITING_PRINCIPLES } from '../constants';

// Initialize the Gemini client, assuming API_KEY is in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

const MEM0_API_KEY = 'm0-DEwYCwPbuKZl2GEHNK4L34y4U31P77rfhWL62r6W';

/**
 * An enhanced in-memory simulation of the Mem0.ai client, serving as the "central brain".
 * It now handles structured memory entries, metadata, and different memory types.
 */
class MockMemoryClient {
  private memoryStore: Map<string, MemoryEntry> = new Map();
  private sessionId: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("Mem0 API Key is required.");
    this.sessionId = this.createNewSessionId();
    console.log(`[Mem0] Client initialized. New Session: ${this.sessionId}`);
  }

  private createNewSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // FIX: The original type signature for `entry` used `Omit` on a type with an index signature,
  // which can be problematic and lead to incorrect type inference. The signature is updated to be
  // more explicit about the expected shape of `entry.metadata`, ensuring the `type` property
  // is correctly recognized when constructing `newEntry`. This resolves the error on line 27.
  async add(entry: { text: string; metadata: { type: MemoryEntry['metadata']['type']; agentId?: PhysicistPersonaId; [key: string]: any; } }): Promise<MemoryEntry> {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newEntry: MemoryEntry = {
      ...entry,
      id,
      metadata: {
        ...entry.metadata,
        sessionId: this.sessionId,
        timestamp: Date.now(),
      }
    };
    this.memoryStore.set(id, newEntry);
    console.log(`[Mem0] ADDED (${newEntry.metadata.type}) - Agent: ${newEntry.metadata.agentId || 'N/A'}`);
    await new Promise(resolve => setTimeout(resolve, 20)); // Simulate latency
    return newEntry;
  }

  async search(query: string, filter: Partial<MemoryEntry['metadata']> = {}): Promise<MemoryEntry[]> {
    console.log(`[Mem0] SEARCHING for "${query}"...`);
    // In a real system, this would be a sophisticated vector search.
    // Here, we simulate by filtering and returning the most recent relevant entries.
    const allEntries = Array.from(this.memoryStore.values());
    const sessionEntries = allEntries.filter(e => e.metadata.sessionId === this.sessionId);
    
    // Simple relevance: return last 5 entries that match the filter.
    const filtered = sessionEntries.filter(e => 
      Object.entries(filter).every(([key, value]) => e.metadata[key] === value)
    );
    const results = filtered.sort((a,b) => a.metadata.timestamp - b.metadata.timestamp);
    console.log(`[Mem0] Found ${results.length} relevant memories.`);
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate latency
    return results;
  }

  async loadKnowledgeBase() {
    console.log('[Mem0] Pre-loading knowledge base...');
    for (const principle of WRITING_PRINCIPLES) {
        await this.add({
            text: `Principle: ${principle.principle}. Explanation: ${principle.explanation}`,
            metadata: { type: 'knowledge_base' }
        });
    }
  }

  clear() {
    console.log(`[Mem0] Clearing memory for session: ${this.sessionId}`);
    this.memoryStore.clear();
    this.sessionId = this.createNewSessionId();
    console.log(`[Mem0] New session started: ${this.sessionId}`);
    this.loadKnowledgeBase();
  }
}

export const memoryClient = new MockMemoryClient(MEM0_API_KEY);


// --- AGENTIC SYSTEM SIMULATION (LANGGRAPH) ---

/**
 * Orchestrator Node (Uses Gemini to generate a plan)
 */
async function orchestratorNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`[Orchestrator] Iteration ${state.iteration}. Creating plan...`);
  const knowledge = await memoryClient.search("Retrieve writing principles.", { type: 'knowledge_base' });
  const personaNames = state.personas.map(pId => PHYSICIST_PERSONAS.find(p => p.id === pId)!.name).join(', ');

  const prompt = `
    You are an orchestrator for a multi-agent AI system. Your role is to create a clear, concise plan for a panel of simulated physicists who will analyze a piece of text.

    **Panelists:** ${personaNames}
    **Core Principles:** ${knowledge.map(k => k.text).join('\n')}
    **User's Text (first 100 chars):** "${state.originalText.substring(0, 100)}..."

    **Task:** Generate a short, numbered plan for the discussion. The plan should guide the agents to provide a multi-faceted critique, leveraging their unique perspectives. Keep the plan to 3-4 steps.
  `;

  const response = await ai.models.generateContent({ model, contents: prompt });
  const plan = response.text;

  await memoryClient.add({ text: `Discussion Plan: ${plan}`, metadata: { type: 'plan' } });
  return { plan };
}

/**
 * Specialist Agent Node (Generates persona responses using Gemini)
 */
async function specialistAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('[Specialists] Starting round table discussion...');
    const newDiscussionTurns: DiscussionTurn[] = [];

    const contextMemories = await memoryClient.search("Get all context for discussion");
    const context = contextMemories.map(m => m.text).join('\n---\n');

    for (const personaId of state.personas) {
        const persona = PHYSICIST_PERSONAS.find(p => p.id === personaId)!;
        
        const prompt = `
          **Your Persona:**
          ${persona.prompt}

          **Your Task:**
          You are part of a round-table discussion with other physicists. Analyze the user's text below based on your unique perspective as ${persona.name}. Keep your response concise (one paragraph). Engage with the plan and what others might have said.

          **Full Discussion Context (Plan & Previous Turns):**
          ---
          ${context}
          ---

          **User's Text to Analyze:**
          ---
          ${state.originalText}
          ---

          Now, provide your analysis as ${persona.name}:
        `;

        const response = await ai.models.generateContent({ model, contents: prompt });
        const responseText = response.text;
        
        const turn: DiscussionTurn = { personaId, personaName: persona.name, text: responseText };

        // Add this turn to memory so subsequent agents can see it.
        await memoryClient.add({ text: `${persona.name}: ${responseText}`, metadata: { type: 'agent_turn', agentId: persona.id } });
        newDiscussionTurns.push(turn);
    }

    return { discussion: [...state.discussion, ...newDiscussionTurns] };
}


/**
 * Reflector Node (Uses Gemini to decide whether to continue the discussion)
 */
async function reflectionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('[Reflector] Analyzing discussion quality...');
    const discussionText = state.discussion.map(turn => `${turn.personaName}: ${turn.text}`).join('\n');

    const prompt = `
      You are a reflector agent, acting as a moderator for a discussion among physicists. Your goal is to ensure the discussion is deep, synergistic, and not just a collection of separate opinions.

      **Discussion So Far:**
      ---
      ${discussionText}
      ---

      **Task:**
      Analyze the discussion. Has it achieved a meaningful synthesis? Or is it still superficial and in need of another round of debate?

      **Respond with a single word followed by a brief reason.**
      - If more debate is needed, respond with "CONTINUE: [Your reason]".
      - If the discussion is sufficient, respond with "FINISH: [Your reason]".
    `;

    const response = await ai.models.generateContent({ model, contents: prompt });
    const decisionText = response.text;
    
    await memoryClient.add({ text: `Reflection: ${decisionText}`, metadata: { type: 'reflection' }});
    
    if (decisionText.startsWith("CONTINUE") && state.iteration < state.maxIterations) {
        console.log(`[Reflector] Decision: CONTINUE. Reason: ${decisionText.replace("CONTINUE:", "").trim()}`);
        return { iteration: state.iteration + 1 };
    } else {
        console.log(`[Reflector] Decision: FINISH. Reason: ${decisionText.replace("FINISH:", "").trim()}`);
        return { finalOutput: state.discussion };
    }
}


/**
 * Main graph execution function.
 * This simulates the flow of a LangGraph by calling nodes in sequence
 * and managing the state object, now with live Gemini calls.
 */
export const runGraph = async (text: string, personas: PhysicistPersonaId[]): Promise<DiscussionTurn[]> => {
  // 1. Initialize State
  let state: AgentState = {
    originalText: text,
    personas,
    plan: '',
    discussion: [],
    scratchpads: {} as Record<PhysicistPersonaId, string>,
    iteration: 1,
    maxIterations: 2, // Controls the depth of reflection
    finalOutput: null,
  };

  // Pre-load knowledge for this session
  await memoryClient.loadKnowledgeBase();
  await memoryClient.add({ text: `User Input: "${text}"`, metadata: { type: 'user_input' } });

  // 2. Run the graph loop
  while (!state.finalOutput) {
    const orchestratorState = await orchestratorNode(state);
    state = { ...state, ...orchestratorState };

    const specialistState = await specialistAgentNode(state);
    state = { ...state, ...specialistState };

    const reflectorState = await reflectionNode(state);
    state = { ...state, ...reflectorState };
  }

  return state.finalOutput || [];
};

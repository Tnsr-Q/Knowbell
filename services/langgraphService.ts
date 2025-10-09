import { DiscussionTurn, PhysicistPersonaId, AgentState, MemoryEntry } from '../types';
import { PHYSICIST_PERSONAS, WRITING_PRINCIPLES } from '../constants';

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
    const results = filtered.slice(-5);
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// --- AGENTIC SYSTEM SIMULATION (LANGGRAPH) ---

/**
 * Orchestrator Node (Simulates DeepSeek Planner)
 * Creates a plan for the other agents to follow.
 */
async function orchestratorNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`[Orchestrator] Iteration ${state.iteration}. Creating plan...`);
  const knowledge = await memoryClient.search("Retrieve writing principles.", { type: 'knowledge_base' });
  
  const plan = `Plan: 
1. Each physicist will analyze the user's text from their unique perspective.
2. The analysis must adhere to the core writing principles found in memory.
3. Each agent will provide a concise, critical paragraph.
4. The Reflector will synthesize these views and check for contradictions or shallow analysis.
The goal is to provide deep, multi-faceted feedback.`;

  await memoryClient.add({ text: plan, metadata: { type: 'plan' } });
  return { plan };
}

/**
 * Specialist Agent Node (Simulates Physicist Personas)
 * Executes one turn of the discussion for each persona.
 */
async function specialistAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('[Specialists] Starting round table discussion...');
    const newDiscussionTurns: DiscussionTurn[] = [];

    for (const personaId of state.personas) {
        const persona = PHYSICIST_PERSONAS.find(p => p.id === personaId)!;
        
        // Simulate thinking: retrieve context from memory
        const contextMemories = await memoryClient.search(`Get context for ${persona.name}`);
        const context = contextMemories.map(m => m.text).join('\n');
        
        const scratchpad = `Thinking Log for ${persona.name}:
- Task: Analyze text: "${state.originalText.substring(0, 50)}..."
- My Core Principle: "${persona.prompt.substring(0, 70)}..."
- Recent Context: ${context ? `"${context.substring(0, 100)}..."` : "None"}
- **Conclusion**: The primary issue is [mock conclusion]. It fails to [mock failure]. My recommendation is to [mock recommendation].`;

        await memoryClient.add({ text: scratchpad, metadata: { type: 'agent_scratchpad', agentId: persona.id } });
        
        const responseText = `Based on my principles, the central argument about ${Math.random().toFixed(2)} is flawed. ${scratchpad.split('**Conclusion**: ')[1]}`;
        const turn: DiscussionTurn = { personaId, personaName: persona.name, text: responseText };

        await memoryClient.add({ text: `${persona.name}: ${responseText}`, metadata: { type: 'agent_turn', agentId: persona.id } });
        newDiscussionTurns.push(turn);
        await sleep(250); // Staggered thinking
    }

    return { discussion: [...state.discussion, ...newDiscussionTurns] };
}


/**
 * Reflector Node (Simulates a separate DeepSeek instance for quality control)
 * Analyzes the output and decides if another iteration is needed.
 */
async function reflectionNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log('[Reflector] Analyzing discussion quality...');
    const reflection = `Reflection: The initial discussion is good but lacks a unified critique. Feynman's point about calculability and Einstein's about geometric principles are currently disconnected. The agents need to debate how these two points intersect.`;
    
    await memoryClient.add({ text: reflection, metadata: { type: 'reflection' }});
    
    if (state.iteration < state.maxIterations) {
        console.log('[Reflector] Decision: CONTINUE. Another iteration is required for deeper synthesis.');
        return { iteration: state.iteration + 1 };
    } else {
        console.log('[Reflector] Decision: FINISH. Maximum iterations reached.');
        return { finalOutput: state.discussion };
    }
}


/**
 * Main graph execution function.
 * This simulates the flow of a LangGraph by calling nodes in sequence
 * and managing the state object.
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
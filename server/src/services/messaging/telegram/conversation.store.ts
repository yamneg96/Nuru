interface ConversationState {
  flow: "idle" | "decision" | "professional" | "support";
  step: number;
  data: Record<string, any>;
  sessionId?: string;
  flowType?: string;
  lastActive: number;
}

class ConversationStore {
  private states = new Map<number, ConversationState>();
  private readonly TTL_MS = 30 * 60 * 1000; // 30 minutes

  getState(chatId: number): ConversationState {
    this.cleanup();
    const state = this.states.get(chatId);
    if (state) {
      state.lastActive = Date.now();
      return state;
    }
    return {
      flow: "idle",
      step: 0,
      data: {},
      lastActive: Date.now(),
    };
  }

  setState(chatId: number, state: Partial<ConversationState>): void {
    const current = this.getState(chatId);
    this.states.set(chatId, { ...current, ...state, lastActive: Date.now() });
  }

  clearState(chatId: number): void {
    this.states.delete(chatId);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [chatId, state] of this.states.entries()) {
      if (now - state.lastActive > this.TTL_MS) {
        this.states.delete(chatId);
      }
    }
  }
}

export const conversationStore = new ConversationStore();

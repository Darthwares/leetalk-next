import { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => BaseMessage[];
    default: () => BaseMessage[];
  };
  // The agent node that last performed work
  sender: string;
}

// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
export const agentState: AgentState = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  sender: "user",
};
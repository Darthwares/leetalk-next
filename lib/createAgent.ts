import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";

export async function createAgent({
  llm,
  tools,
  systemMessage,
}: {
  llm: ChatOpenAI | ChatAnthropic;
  tools: Tool[];
  systemMessage: string;
}): Promise<Runnable> {
  const toolNames = tools.map((tool) => tool.name).join(", ");
  const formattedTools = tools.map((t) => convertToOpenAITool(t));

  let prompt = await ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant, collaborating with other assistants." +
        " Use the provided tools to progress towards answering the question." +
        " If you are unable to fully answer, that's OK, another assistant with different tools " +
        " will help where you left off. Execute what you can to make progress." +
        " If you or any of the other assistants have the final answer or deliverable," +
        " prefix your response with FINAL ANSWER so the team knows to stop." +
        " You have access to the following tools: {tool_names}.\n{system_message}",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  prompt = await prompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
  })

  // @ts-ignore
  return prompt.pipe(llm.bind({ tools: formattedTools }));
}

const isToolMessage = (message: BaseMessage) => !!message?.additional_kwargs?.tool_calls;

export type RunAgentNodeParams = { state: BaseMessage[], agent: Runnable, name: string };

export async function runAgentNode({ state, agent, name }: RunAgentNodeParams) {
  let result = await agent.invoke(state);
  // We convert the agent output into a format that is suitable
  // to append to the global state
  if (!isToolMessage(result)) {
    // If the agent is NOT calling a tool, we want it to
    // look like a human message.
    result = new HumanMessage({ ...result, name: name });
  }
  return {
    messages: [result],
    // Since we have a strict workflow, we can
    // track the sender so we know who to pass to next.
    sender: name,
  };
}

export function router(state: any) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  if (isToolMessage(lastMessage)) {
    // The previous agent is invoking a tool
    return "call_tool";
  }
  if (typeof lastMessage.content === 'string' && lastMessage.content.includes("FINAL ANSWER")) {
    // Any agent decided the work is done
    return "end";
  }
  return "continue";
}
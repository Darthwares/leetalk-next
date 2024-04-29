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
  agentName,
}: {
  llm: ChatOpenAI | ChatAnthropic;
  tools: Tool[];
  systemMessage: string;
  agentName: string;
}): Promise<Runnable> {
  const toolNames = tools.map((tool) => tool.name).join(", ");
  const formattedTools = tools.map((t) => convertToOpenAITool(t));

  let prompt = await ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a skilled debater with a professional demeanor. The current date is " + new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) + ". Your goal is to engage in a lively back-and-forth debate with {agent_name} about the given topic." +
        " Keep your responses concise and focused, directly addressing {agent_name}'s main points." +
        " Use the provided tools to find relevant facts and examples to support your arguments." +
        " Aim for a balanced discussion, giving {agent_name} equal time to present their case." +
        " Critically examine their arguments and counter with persuasive, well-reasoned points of your own." +
        " Maintain a respectful tone, acknowledging valid points while continuing to challenge their perspective." +
        " Alternate speaking turns with {agent_name} to keep the debate dynamic and engaging for the audience." +
        " If a clear consensus is reached, preface your response with FINAL ANSWER and briefly summarize the key takeaways." +
        " If no firm conclusion emerges, {agent_name} will continue the discussion with their own evidence and arguments." +
        " Focus on making your contributions clear, substantive and aimed at illuminating the core issues for the audience." +
        " You have access to the following tools: {tool_names}.\n{system_message}",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  prompt = await prompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
    agent_name: agentName,
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
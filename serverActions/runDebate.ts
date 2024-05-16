'use server';

import { HumanMessage, BaseMessage } from '@langchain/core/messages';
import { END, StateGraph } from '@langchain/langgraph';
import { createAgent, router, runAgentNode } from '@/lib/createAgent';
import { claude_sonnet, openAI_GPT35 } from '@/lib/llm';
import { tavilyTool } from '@/lib/tavilySearchTool';
import { agentState } from '@/lib/agentState';
import { toolNode } from '@/lib/toolNode';
import { supabase } from '@/lib/supabase';

export async function runDebate(topic: string, id: string) {
  try {
    const graph = new StateGraph({
      channels: agentState,
    });

    const openAIDebateAgent = await createAgent({
      llm: openAI_GPT35,
      tools: [tavilyTool],
      agentName: 'Claude',
      systemMessage:
        "You are an AI assistant named OpenAI. Your role is to engage in a debate with another AI assistant named Claude. Analyze the given topic and provide your perspective, while also considering and responding to Claude's arguments. The debate should continue until a satisfactory conclusion is reached. As an engineer, aim to provide technical insights and logical reasoning to support your position.",
    });

    const sonnetDebateAgent = await createAgent({
      llm: claude_sonnet,
      tools: [],
      agentName: 'OpenAI',
      systemMessage:
        "You are an AI assistant named Claude. Your role is to engage in a debate with another AI assistant named GPT. Analyze the given topic and provide your perspective, while also considering and responding to GPT's arguments. The debate should continue until a satisfactory conclusion is reached. Aim to provide well-reasoned and insightful arguments to support your position.",
    });

    const openAIDebaterNode = async (state: BaseMessage[]) => {
      return runAgentNode({
        state: state,
        agent: openAIDebateAgent,
        name: 'openAIDebater',
        topic: topic,
        id: id,
      });
    };

    const claudeDebaterNode = async (state: BaseMessage[]) => {
      return runAgentNode({
        state: state,
        agent: sonnetDebateAgent,
        name: 'claudeDebater',
        topic: topic,
        id: id,
      });
    };

    graph.addNode('claudeDebater', claudeDebaterNode);
    graph.addNode('openAIDebater', openAIDebaterNode);
    graph.addNode('call_tool', toolNode);

    graph.addConditionalEdges('claudeDebater', router, {
      // We will transition to the other agent
      continue: 'openAIDebater',
      call_tool: 'call_tool',
      end: END,
    });

    graph.addConditionalEdges('openAIDebater', router, {
      // We will transition to the other agent
      continue: 'claudeDebater',
      call_tool: 'call_tool',
      end: END,
    });

    graph.addConditionalEdges(
      'call_tool',
      // Each agent node updates the 'sender' field
      // the tool calling node does not, meaning
      // this edge will route back to the original agent
      // who invoked the tool
      (x: any) => x.sender,
      {
        claudeDebater: 'claudeDebater',
        openAIDebater: 'openAIDebater',
      }
    );

    graph.setEntryPoint('openAIDebater');

    const runnable = graph.compile();

    const res = await runnable.invoke(
      {
        messages: [
          new HumanMessage({
            content: topic,
          }),
        ],
      },
      { recursionLimit: 50 }
    );

    // console.log(res.message.kwargs!);
    console.log(res);

    // Insert the topic into the 'conversations' table

    return res;
  } catch (error: any) {
    console.error("run debate error",error.message);
    throw error; 
  }
}

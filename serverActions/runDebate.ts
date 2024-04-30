'use server';

import { HumanMessage, BaseMessage } from '@langchain/core/messages';
import { END, StateGraph } from '@langchain/langgraph';
import { createAgent, router, runAgentNode } from '@/lib/createAgent';
import { claude_sonnet, openAI_GPT35 } from '@/lib/llm';
import { tavilyTool } from '@/lib/tavilySearchTool';
import { agentState } from '@/lib/agentState';
import { toolNode } from '@/lib/toolNode';
import { supabase } from '@/lib/supabase';

export async function runDebate(topic: string) {
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

    const criticDAgent = await createAgent({
      llm: openAI_GPT35,
      tools: [tavilyTool],
      agentName: 'Critic',
      systemMessage:
        "You are the Critic agent. Your role is to closely follow the debate between the AI assistants Claude and OpenAI. Analyze their arguments and the overall flow of the debate. After each agent's statement, pose a challenging counter-question to further probe their reasoning. This will help elucidate deeper insights and test the robustness of their arguments. Once you determine that a satisfactory conclusion has been reached, summarize the key points made by both Claude and GPT, and provide your own conclusion on the topic based on the debate. Your conclusion should take into account the strengths and weaknesses of the arguments presented by both agents. The questioning session will last for 2 rounds",
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
        topic: topic
      });
    };

    const criticDebaterNode = async (state: BaseMessage[]) => {
      return runAgentNode({
        state: state,
        agent: criticDAgent,
        name: 'criticDebater',
        topic: topic
      });
    };

    const claudeDebaterNode = async (state: BaseMessage[]) => {
      return runAgentNode({
        state: state,
        agent: sonnetDebateAgent,
        name: 'claudeDebater',
        topic: topic
      });
    };

    graph.addNode('claudeDebater', claudeDebaterNode);
    graph.addNode('openAIDebater', openAIDebaterNode);
    graph.addNode('criticDebater', criticDebaterNode);
    graph.addNode('call_tool', toolNode);

    graph.addConditionalEdges('claudeDebater', router, {
      // We will transition to the other agent
      continue: 'openAIDebater',
      call_tool: 'call_tool',
      end: END,
    });

    graph.addConditionalEdges('criticDebater', router, {
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
        criticDebater: 'criticDebater',
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
    const { data: conversationData, error: conversationError } = await supabase
        .from('agentsConvo')
        .insert({ topic: topic, conversation: res })

    return res;
  } catch (error: any) {
    console.error(error);
  }
}

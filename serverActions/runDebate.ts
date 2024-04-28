"use server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";
import { END, StateGraph } from "@langchain/langgraph";
import { createAgent, router, runAgentNode } from "@/lib/createAgent";
import { claude_sonnet, openAI_GPT35 } from "@/lib/llm";
import { tavilyTool } from "@/lib/tavilySearchTool";
import { agentState } from "@/lib/agentState";
import { toolNode } from "@/lib/toolNode";

export async function runDebate(topic: string) {
  try {
    const graph = new StateGraph({
      channels: agentState,
    });

    const openAIDebateAgent = await createAgent({
      llm: openAI_GPT35,
      tools: [tavilyTool],
      systemMessage:
        "You are OpenAI, You debate about a point given a topic. You can use the tools to research and provide evidence. Build an argument and counter-argument as there wil be another AI to debate with you.",
    });

    const sonnetDebateAgent = await createAgent({
      llm: claude_sonnet,
      tools: [],
      systemMessage:
        "You are Claude, You debate about a point given a topic. You can use the tools to research and provide evidence. Build an argument and counter-argument as there wil be another AI to debate with you.",
    });

    const openAIDebaterNode = async (state: BaseMessage[]) => {
      return runAgentNode({
        state: state,
        agent: openAIDebateAgent,
        name: "openAIDebater",
      });
    }

    // test
    // const debater = await openAIDebaterNode([new HumanMessage(topic)]);

    const claudeDebaterNode = async (state: BaseMessage[]) => {
      return runAgentNode({
        state: state,
        agent: sonnetDebateAgent,
        name: "claudeDebater",
      });
    }

    graph.addNode("claudeDebater", claudeDebaterNode);
    graph.addNode("openAIDebater", openAIDebaterNode);
    graph.addNode("call_tool", toolNode);

    graph.addConditionalEdges(
      "claudeDebater",
      router,
      {
        // We will transition to the other agent
        continue: "openAIDebater", 
        call_tool: "call_tool", 
        end: END,
      },
    );
    
    graph.addConditionalEdges(
      "openAIDebater",
      router,
      {
        // We will transition to the other agent
        continue: "claudeDebater",
        call_tool: "call_tool",
        end: END,
      },
    );
    
    graph.addConditionalEdges(
      "call_tool",
      // Each agent node updates the 'sender' field
      // the tool calling node does not, meaning
      // this edge will route back to the original agent
      // who invoked the tool
      (x: any) => x.sender,
      {
        claudeDebater: "claudeDebater",
        openAIDebater: "openAIDebater",
      },
    );;

    graph.setEntryPoint("openAIDebater");

    const runnable = graph.compile();

    const res = await runnable.invoke({
      messages: [
        new HumanMessage({
          content:
            topic,
        }),
      ],
    },
    { recursionLimit: 150 });

    console.log(res);
  } catch (error: any) {
    console.error(error);
  }
}
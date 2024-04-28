import { ToolExecutor } from "@langchain/langgraph/prebuilt";
import { ToolMessage } from "@langchain/core/messages";
import { tavilyTool } from "./tavilySearchTool";

const tools = [tavilyTool];
const toolExecutor = new ToolExecutor({ tools });

// This runs tools in the graph
export async function toolNode(state: any) {
  // It takes in an agent action and calls that tool and returns the result.
  const messages = state.messages;
  // Based on the continue condition
  // we know the last message involves a function call
  const lastMessage = messages[messages.length - 1];
  const toolCalls = lastMessage.additional_kwargs.tool_calls;
  const toolInputs = toolCalls.map((toolArgs: any) => {
    let args = JSON.parse(toolArgs.function.arguments);
    // We can pass single-arg inputs by value
    if ("__arg1" in args && args.length === 1) {
      args = args["__arg1"];
    }
    return {
      tool: toolArgs.function.name,
      toolInput: args,
    };
  });

  const toolResponses = await toolExecutor.batch(toolInputs);
  const toolMessages = toolResponses.map((response, idx) => {
    const action = toolInputs[idx];
    const toolName = action.tool;
    return new ToolMessage({
      content: `${toolName} response: ${response}`,
      name: action.tool,
      tool_call_id: toolCalls[idx].id,
    });
  });

  // We return an object, because this will get
  // added to the existing list
  return { messages: toolMessages };
}
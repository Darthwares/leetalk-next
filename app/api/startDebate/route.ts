
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";
import { END, MessageGraph } from "@langchain/langgraph";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data); 

    const model = new ChatOpenAI({ temperature: 0 });

    const graph = new MessageGraph();

    graph.addNode("oracle", async (state: BaseMessage[]) => {
      return model.invoke(state);
    });

    graph.addEdge("oracle", END);

    graph.setEntryPoint("oracle");

    const runnable = graph.compile();

    return new Response(JSON.stringify({ message: "Data received and stored in Redis." }), {
      headers: { "Content-Type": "application/json" },
      status: 201
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: "Error processing request", error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}
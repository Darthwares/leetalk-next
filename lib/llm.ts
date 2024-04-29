import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

export const openAI_GPT4_Turbo = new ChatOpenAI({ modelName: "gpt-4-turbo" });
export const openAI_GPT4 = new ChatOpenAI({ modelName: "gpt-4" });
export const openAI_GPT35 = new ChatOpenAI({ modelName: "gpt-3.5-turbo-16k" });

export const claude_sonnet = new ChatAnthropic({ modelName: "claude-3-sonnet-20240229" });
export const claude_haiku = new ChatAnthropic({ modelName: "claude-3-haiku-20240307" });
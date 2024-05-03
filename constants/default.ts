import { Message } from "@/types/types";

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const optionsDate: any = { day: '2-digit', month: 'short', year: 'numeric' };
  const optionsTime: any = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedDate = date.toLocaleDateString('en-US', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
  return `${formattedDate}, ${formattedTime}`;
}

export function processMessages(messages: Message[]) {
  let conclusion;

  const lastMessageWithFinalAnswer = messages?.find((message) =>
    message?.message_text?.includes("FINAL ANSWER")
  );
  let hasFinalAnswer = lastMessageWithFinalAnswer ? true : false;
  if (hasFinalAnswer) {
    conclusion = lastMessageWithFinalAnswer!.message_text;
  }

  const remainingMessages = messages?.filter(
    (message) => !message?.message_text?.includes("FINAL ANSWER")
  );

  return { conclusion, remainingMessages };
}
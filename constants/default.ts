import { Message } from "@/types/types";

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const optionsDate: any = { day: "2-digit", month: "short", year: "numeric" };
  const optionsTime: any = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate);
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
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

export function timeAgo(dateParam: string) {
  const date = new Date(dateParam);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000; // Calculate the number of years
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000; // Calculate the number of months
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400; // Calculate the number of days
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600; // Calculate the number of hours
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60; // Calculate the number of minutes
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago"; // Calculate the number of seconds
}

export function getFormattedDate() {
  const date = new Date();

  // Build the date and time parts
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padEnd(5, '0'); // Ensure milliseconds are 5 digits

  // Get the timezone offset in hours and minutes
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(timezoneOffset / 60).toString().padStart(2, '0');
  const offsetMinutes = Math.abs(timezoneOffset % 60).toString().padStart(2, '0');
  const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

  // Combine all parts
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${offsetHours}:${offsetMinutes}`;
}

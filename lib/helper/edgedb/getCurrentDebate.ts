"use server";

let debateMessages: any[] = [];

export default async function getCurrentDebate(
  message: string,
  name: string,
  id: string
) {
  // Store the message
  let debate = {
    message,
    name,
    id,
  };
  debateMessages.push(debate);
  console.log("debateMessages inside", debateMessages);
  return true;
}

console.log("debateMessages outside", debateMessages);

export async function returnedDebate() {
  console.log("debateMessages returned", debateMessages);
  return debateMessages;
}

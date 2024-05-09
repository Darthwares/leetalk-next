// interfaces.ts
export interface Message {
  message_id: string;
  conversation_id: string;
  message_text: string;
  sender: string;
  created_at: string;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface Conversations{
  conversation_id: string;
  topic: string;
  created_at: string;
  updated_at: string;
}

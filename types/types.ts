import { Dispatch, SetStateAction } from "react";

// interfaces.ts
export interface Message {
  message_id: string;
  conversation_id: string;
  message_text: string;
  sender: string;
  created_at: string;
  audio_url?: string;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface Conversations {
  conversation_id: string;
  user_id: string;
  topic: string;
  created_at: string;
  updated_at: string;
  imageURL: string;
  viewCount: number;
  category: string;
  published: boolean;
  first_message_text?: boolean;
}

export type Category = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type Card = {
  imgUrl: string;
  title: string;
};

export type Cards = {
  [key: string]: Card[];
};

export interface AuthenticationModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  setCurrentCategory: Dispatch<SetStateAction<string>>;
  setCurrentTitle: Dispatch<SetStateAction<string>>;
  conversationId: string;
  currentTitle: string;
  currentCategory: string;
  onEditSuccess: (updatedDebate: any) => void; 
}
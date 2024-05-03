import { Conversations, Message } from '@/types/types';
import { atom } from 'recoil';

const conversationIdState = atom<string>({
  key: 'conversationIdState',
  default: '',
});
const messagesState = atom<Message[]>({
  key: 'messagesState',
  default: [],
});
const singleTopicState = atom<Conversations>({
  key: 'singleTopicState',
  default: {
    topic: '',
    created_at: '',
    updated_at: '',
    conversation_id: '',
  },
});
const loaderState = atom<boolean>({
  key: 'loaderState',
  default: false,
});
const showDebateInputBoxState = atom<boolean>({
  key: 'showDebateInputBoxState',
  default: true,
});
const waitingMessageState = atom<string>({
  key: 'waitingMessageState',
  default: 'Lets start a debate!',
});

export {
  conversationIdState,
  messagesState,
  loaderState,
  singleTopicState,
  waitingMessageState,
  showDebateInputBoxState,
};

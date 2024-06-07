import { Conversations, Message } from "@/types/types";
import { atom } from "recoil";
import { atomFamily } from "recoil";
// state/likesState.js
const messageLikesState = atomFamily({
  key: "messageLikesState",
  default: 0, // Default likes count is 0
});

// state/emojiState.js
const messageEmojiState = atomFamily({
  key: "messageEmojiState",
  default: [], // Default is an empty array of emojis
});

const conversationIdState = atom<string>({
  key: "conversationIdState",
  default: "",
});
const messagesState = atom<Message[]>({
  key: "messagesState",
  default: [],
});
const singleTopicState = atom<Conversations>({
  key: "singleTopicState",
  default: {
    topic: "",
    created_at: "",
    updated_at: "",
    conversation_id: "",
    imageURL: "",
    user_id: "",
    viewCount: 0,
    category: "",
    published: false,
  },
});
const loaderState = atom<boolean>({
  key: "loaderState",
  default: false,
});
const showDebateInputBoxState = atom<boolean>({
  key: "showDebateInputBoxState",
  default: true,
});
const waitingMessageState = atom<string>({
  key: "waitingMessageState",
  default: "Lets start a debate!",
});
const debateListState = atom<any[]>({
  key: "debateListState",
  default: [],
});
const debateCategoryState = atom<string | null>({
  key: "debateCategoryState",
  default: "Technology",
});
const topicListState = atom<Conversations[]>({
  key: "topicListState",
  default: [],
});
const showPublishState = atom<boolean>({
  key: "showPublishState",
  default: true,
});
const showTopicState = atom<string>({
  key: "showTopicState",
  default: "",
});
const currentAudioIndexState = atom<number>({
  key: "currentAudioIndexState",
  default: 0,
});
const playFullAudioState = atom<boolean>({
  key: "playFullAudioState",
  default: false,
});

const isGlobalAudioPlayingState = atom<boolean>({
  key: "isGlobalAudioPlayingState",
  default: false,
});
const showAudioPlayingState = atom<boolean>({
  key: "showAudioPlayingState",
  default: false,
});
const showCurrentPlayingURL = atom<string>({
  key: "showCurrentPlayingURL",
  default: "",
});

export {
  conversationIdState,
  messagesState,
  loaderState,
  singleTopicState,
  waitingMessageState,
  showDebateInputBoxState,
  messageLikesState,
  messageEmojiState,
  debateListState,
  debateCategoryState,
  topicListState,
  showPublishState,
  showTopicState,
  currentAudioIndexState,
  playFullAudioState,
  isGlobalAudioPlayingState,
  showAudioPlayingState,
  showCurrentPlayingURL,
};

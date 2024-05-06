// interfaces.ts
export interface Message {
  message_id: string;
  conversation_id: string;
  message_text: string;
  avatarAlt: string;
  avatarSrc: string;
  avatarFallback: string;
  sender: string;
  timestamp: string;
  isUser: boolean;
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

export interface User {
  name: string;
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface UserMetadata {
  avatar_url: string;
  custom_claims: CustomClaims;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
}

interface CustomClaims {
  hd: string;
}

interface Identity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

interface IdentityData {
  avatar_url: string;
  custom_claims: CustomClaims;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
}
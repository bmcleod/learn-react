export interface Message {
  uid: string;
  authorName: string;
  avatar?: string;
  email: string;
  text: string;
  time: number;
}

export interface ServerMessage {
  id: string;
  uid: string;
  authorName: string;
  avatar?: string;
  email: string;
  text: string;
  time: number;
}

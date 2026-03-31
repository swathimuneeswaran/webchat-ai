export type AppState = 'input' | 'analyzing' | 'qa';




export interface Message {
  id: string;
  question: string;
  answer: string;
  sources?: { text: string; url: string }[];
}
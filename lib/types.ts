import { Timestamp } from "firebase/firestore";

export interface Vital {
  id: string;
  patientId: string;
  heartRate: number;
  SpO2: number;
  temperature: number;
  prediction: boolean;
  timestamp: Timestamp;
}

export interface Post {
  id: string;
  patientId: string;
  postId: string;
  content: string;
  imageUrl: string;
  textSentiment: string;
  imageSentiment: string;
  finalSentiment: string;
  userHandle: string;
  timestamp: Timestamp;
}

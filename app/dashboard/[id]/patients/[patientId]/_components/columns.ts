import { Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";

interface Vital {
  id: string;
  patientId: string;
  heartRate: number;
  SpO2: number;
  temperature: number;
  prediction: boolean;
  timestamp: Timestamp;
}

interface Post {
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

export const vitalColumns: ColumnDef<Vital>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ getValue }) => {
      const timestamp = getValue<Timestamp>();
      return new Date(timestamp.seconds * 1000).toLocaleString();
    },
  },
  {
    accessorKey: "heartRate",
    header: "Heart Rate",
  },
  {
    accessorKey: "SpO2",
    header: "SpO2",
  },
  {
    accessorKey: "temperature",
    header: "Temperature",
  },
  {
    accessorKey: "prediction",
    header: "Prediction",
  },
];

export const postColumns: ColumnDef<Post>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ getValue }) => {
      const timestamp = getValue<Timestamp>();
      return new Date(timestamp.seconds * 1000).toLocaleString();
    },
  },
  {
    accessorKey: "textSentiment",
    header: "Text Sentiment",
  },
  {
    accessorKey: "imageSentiment",
    header: "Image Sentiment",
  },
  {
    accessorKey: "finalSentiment",
    header: "Final Sentiment",
  },
];

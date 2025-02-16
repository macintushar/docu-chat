export type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type KnowledgeDocument = {
  file_id: string;
  created_at: string;
  filename: string;
  file_type: string;
};

export type KnowledgeDocumentDownload = {
  file: string;
};

export type MessageResponse = {
  message: string;
};

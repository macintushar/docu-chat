export type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
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

export type Model = {
  name: string;
  model: string;
};

export type ChatConfig = {
  configs: {
    models: Model[];
  };
};

export type ChatSession = {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: MessageType[];
};

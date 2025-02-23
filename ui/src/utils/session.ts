import { ChatSession, MessageType } from "@/types";

export function createSession() {
  const sessionStorage = window.sessionStorage;
  const storedSessions = sessionStorage.getItem("sessions");
  const sessions = JSON.parse(storedSessions || "[]") as ChatSession[];
  const sessionId = crypto.randomUUID();
  sessions.push({
    session_id: sessionId,
    title: "New Chat",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages: [],
  });
  sessionStorage.setItem("sessions", JSON.stringify(sessions));
  return sessionId;
}

export function getSessions() {
  const sessionStorage = window.sessionStorage;
  const storedSessions = sessionStorage.getItem("sessions");
  return JSON.parse(storedSessions || "[]") as ChatSession[];
}

export function deleteSession(sessionId: string) {
  const sessionStorage = window.sessionStorage;
  const storedSessions = sessionStorage.getItem("sessions");
  const sessions = JSON.parse(storedSessions || "[]") as ChatSession[];
  const filteredSessions = sessions.filter(
    (session) => session.session_id !== sessionId,
  );
  sessionStorage.setItem("sessions", JSON.stringify(filteredSessions));
}

export function getSession(sessionId: string) {
  const sessionStorage = window.sessionStorage;
  const storedSessions = sessionStorage.getItem("sessions");
  const sessions = JSON.parse(storedSessions || "[]") as ChatSession[];
  return sessions.find((session) => session.session_id === sessionId);
}

export function updateSession(sessionId: string, messages: MessageType[]) {
  const sessionStorage = window.sessionStorage;
  const storedSessions = sessionStorage.getItem("sessions");
  const sessions = JSON.parse(storedSessions || "[]") as ChatSession[];
  const session = sessions.find((session) => session.session_id === sessionId);
  if (session) {
    session.messages = messages;
    sessionStorage.setItem("sessions", JSON.stringify(sessions));
  }
}

export function updateSessionTitle(sessionId: string, title: string) {
  const sessionStorage = window.sessionStorage;
  const storedSessions = sessionStorage.getItem("sessions");
  const sessions = JSON.parse(storedSessions || "[]") as ChatSession[];
  const session = sessions.find((session) => session.session_id === sessionId);
  if (session) {
    session.title = title;
    sessionStorage.setItem("sessions", JSON.stringify(sessions));
  }
}

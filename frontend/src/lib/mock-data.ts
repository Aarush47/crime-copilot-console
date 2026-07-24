export type Severity = "low" | "elevated" | "critical";
export type AlertSeverity = "low" | "warning" | "elevated" | "critical";

export interface CaseMarker {
  id: string;
  district: string;
  position: { top: string; left: string };
  lat: number;
  lng: number;
  severity: Severity;
  caseCount: number;
  crimeType: string;
  unit: string;
  status: string;
  registeredDate: string;
  accused: string;
  briefFacts: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface ChatMessage {
  role: "user" | "agent";
  text: string;
  timestamp: string;
  query?: { tables: string[]; sql: string };
}

export const cases: CaseMarker[] = [];
export const alerts: Alert[] = [];
export const initialChat: ChatMessage[] = [];

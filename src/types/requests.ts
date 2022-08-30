export interface Cast {
  name: string;
  base64: string;
  points: string[];
  defaults: Record<string, number>;
  segments: Record<string, string[]>;
}

export interface SettlementItem {
  id: string;
  repeat: number;
  cutImage: string;
}

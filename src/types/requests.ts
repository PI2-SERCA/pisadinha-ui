export interface Cast {
  name: string;
  points: string[];
  defaults: Record<string, number>;
  segments: Record<string, string[]>;
}

export interface SettlementItem {
  id: string;
  repeat: number;
  cutImage: string;
}

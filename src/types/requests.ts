export interface Cast {
  name: string;
  base64: string;
  points: string[];
  defaults: Record<string, number>;
  segments: Record<string, string[]>;
}

export interface Cut {
  id: string;
  base64: string;
  quantity: number;
  points: [number, number][];
}

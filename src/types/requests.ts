export interface RequestResponse {
  name: string;
  points: string[];
  defaults: Record<string, number>;
  segments: Record<string, string[]>;
}

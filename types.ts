
export interface Habit {
  id: number;
  name: string;
  // YYYY-MM-DD: boolean
  completions: Record<string, boolean>;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
}

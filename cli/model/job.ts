export interface Job {
  total_count: number;
  workflow: {
    id: number;
    name: string;
  };
  jobs: {
    started_at: string;
    completed_at: string;
    name: string;
    steps: {
      name: string;
      number: number;
      started_at: string;
      completed_at: string;
    }[];
  }[];
}

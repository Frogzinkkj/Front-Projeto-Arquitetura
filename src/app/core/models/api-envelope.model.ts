export interface ApiEnvelope<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  errors: unknown[];
}
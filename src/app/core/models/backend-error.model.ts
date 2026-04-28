export interface BackendValidationError {
  field: string;
  code: string;
  message: string;
}

export interface BackendError {
  timestamp: string;
  status: number;
  message: string;
  data: null;
  errors: BackendValidationError[];
}
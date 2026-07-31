export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
}

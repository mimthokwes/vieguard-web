export interface User {
  id: string | bigint;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

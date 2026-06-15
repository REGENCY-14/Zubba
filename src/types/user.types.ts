import { User } from "../slices/auth/auth.types";

export interface UsersListResponse {
  users: User[];
  metadata: {
    total: number;
    pages: number;
    current_page: number;
    limit: number;
  };
}

export interface UpdateUserDto {
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
}

export interface FindUserDto {
  authKey: "email" | "phone";
  authValue: string;
}
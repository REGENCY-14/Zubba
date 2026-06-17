import { api } from "./axios";
import {
  UsersListResponse,
  UpdateUserDto,
  FindUserDto,
} from "../types/user.types";
import { User } from "../slices/auth/auth.types";
import { ApiResponse } from "../types/api.types";

export const userService = {
  getUsers: async (params?: { limit?: number; current_page?: number }) => {
    const { data } = await api.get<ApiResponse<UsersListResponse>>("/users", {
      params,
    });
    return data;
  },

  getUserById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return data;
  },

  updateUser: async (id: string, payload: UpdateUserDto) => {
    const { data } = await api.patch<ApiResponse<{ message: string }>>(
      `/users/${id}`,
      payload,
    );
    return data;
  },

  findUser: async (params: {
    authKey: "email" | "phone";
    authValue: string;
  }) => {
    const { data } = await api.get<ApiResponse<{ user: User }>>("/users/find", {
      params,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<{ user: User }>>("/users/me");
    return data;
  },
};

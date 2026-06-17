import { api } from "./axios";
import { ApiResponse } from "../types/api.types";
import { Customer } from "../slices/customer/customer.types";

export const customerService = {
  getCustomerById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ user: Customer }>>(`/customers/${id}`);
    return data;
  },
};

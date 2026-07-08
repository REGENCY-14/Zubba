import { api } from "./axios";
import { ApiResponse } from "../types/api.types";
import { Customer } from "../slices/customer/customer.types";

export const customerService = {
  getCustomerById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ customer: Customer }>>(`/customers/${id}`);
    return data;
  },

  requestTakeout: async (params: NearbyDriversParams) => {
    const { data } = await api.post<ApiResponse<any>>(
      '/customers/requests'
    )
  }
};

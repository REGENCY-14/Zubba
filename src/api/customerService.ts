import { api } from "./axios";
import { ApiResponse, PagedApiResponse } from "../types/api.types";
import { Customer } from "../slices/customer/customer.types";
import { GetRequestsQuery, RequestTakeout } from "../types/request.types";

export const customerService = {
  getCustomerById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ customer: Customer }>>(`/customers/${id}`);
    return data;
  },

  requestTakeout: async (payload: RequestTakeout) => {
    const { data } = await api.post<ApiResponse<any>>(
      '/customers/requests',
      payload
    )
    return data
  },

  getCustomerRequests: async (payload: GetRequestsQuery) => {
    const { data } = await api.get<PagedApiResponse<any>>(
      `/customers/requests?limit=${payload.limit}&current_page=${payload.current_page}&offset=${payload.offset}`
    )
    return data
  },

  getRequestById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ customer: RequestTakeout }>>(`/customers/requests/${id}`);
    return data;
  },
};

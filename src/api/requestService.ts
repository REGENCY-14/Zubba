import { api } from "./axios";
import { ApiResponse } from "../types/api.types";
import { RequestTakeout } from "../types/request.types";

export const requestService = {
  updateRequestStatus: async (id: string, status: "pending" | "accepted" | "en_route" | "arrived" | "completed" | "cancelled") => {
    console.log("updating user status: ", status)
    const { data } = await api.patch<ApiResponse<{ request: RequestTakeout }>>(
        `customer/requests/${id}/status`,
        { status }
    );
    return data;
  },
};

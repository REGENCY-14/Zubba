import { api } from "./axios";
import { ApiResponse } from "../types/api.types";
import { NearbyDriver, NearbyDriversParams } from "../types/driver.types";

export const driverService = {
  getNearbyDrivers: async (params: NearbyDriversParams) => {
    const { data } = await api.get<ApiResponse<{ drivers: NearbyDriver[] }>>(
      `/drivers/nearby`,
      { params }
    );
    return data;
  },
};
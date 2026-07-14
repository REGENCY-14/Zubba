import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DriverRequest {
  driver_id: string;
  name: string;
  avatar: string;
  code: string;
  rating: number;
}

export interface RequestState {
  customer_id: string;
  driver: DriverRequest;
  pickup_location: string;
  pickup_address: string;
  status: string;
  payment_method: string;
  bags: number;
  distance_m: number;
  pickup_price: number;
  service_price: number;
  date_created: Date;
  collection_code: number;
  scheduleRequest: boolean;
}

const initialState: RequestState = {
  customer_id: "",
  driver: {
    driver_id: "",
    name: "",
    avatar: "",
    code: "",
    rating: 0,
  },
  pickup_location: "",
  pickup_address: "",
  status: "",
  payment_method: "",
  bags: 0,
  distance_m: 0,
  pickup_price: 0,
  service_price: 0,
  date_created: new Date(),
  collection_code: 0,
  scheduleRequest: false,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setRequest(state, action: PayloadAction<Partial<RequestState>>) {
      Object.assign(state, action.payload);
    },

    setCustomerId(state, action: PayloadAction<string>) {
      state.customer_id = action.payload;
    },

    setRequestDriver(state, action: PayloadAction<DriverRequest>) {
      state.driver = action.payload;
    },

    setDriverId(state, action: PayloadAction<string>) {
      state.driver.driver_id = action.payload;
    },

    setPickupLocation(state, action: PayloadAction<string>) {
      state.pickup_location = action.payload;
    },

    setPickupAddress(state, action: PayloadAction<string>) {
      state.pickup_address = action.payload;
    },

    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },

    setPaymentMethod(state, action: PayloadAction<string>) {
      state.payment_method = action.payload;
    },

    setBags(state, action: PayloadAction<number>) {
      state.bags = action.payload;
    },

    setDistanceM(state, action: PayloadAction<number>) {
      state.distance_m = action.payload;
    },

    setPickupPrice(state, action: PayloadAction<number>) {
      state.pickup_price = action.payload;
    },

    setServicePrice(state, action: PayloadAction<number>) {
      state.service_price = action.payload;
    },

    setScheduleRequest(state, action: PayloadAction<boolean>) {
      state.scheduleRequest = action.payload;
    },

    resetRequest() {
      return initialState;
    },
  },
});

export const {
  setRequest,
  setCustomerId,
  setRequestDriver,
  setDriverId,
  setPickupLocation,
  setPickupAddress,
  setStatus,
  setPaymentMethod,
  setBags,
  setDistanceM,
  setPickupPrice,
  setServicePrice,
  setScheduleRequest,
  resetRequest,
} = requestSlice.actions;

export const requestReducer = requestSlice.reducer;
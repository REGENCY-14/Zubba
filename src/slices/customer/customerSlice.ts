import { createSlice } from "@reduxjs/toolkit";
import { Customer } from "./customer.types";

const initialState: Customer = {
    id: "",
    points: 0,
    mass_recycled: 0,
    is_premium: false,
}

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {}
})

export const {} = customerSlice.actions
export const customerReducer = customerSlice.reducer
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    reducers: {
        setCustomer: (state, action: PayloadAction<{
            id: string, points: number, mass_recycled: number,
            is_premium: boolean
        }>) => {
            state.id = action.payload.id;
            state.points = action.payload.points;
            state.mass_recycled = action.payload.mass_recycled;
            state.is_premium = action.payload.is_premium;
        },
        clearCustomer: (state) => {
            state = initialState
        },
        upgradeToPremium: (state) => {
            state.is_premium = true;
        },
    }
})

export const { upgradeToPremium } = customerSlice.actions
export const customerReducer = customerSlice.reducer
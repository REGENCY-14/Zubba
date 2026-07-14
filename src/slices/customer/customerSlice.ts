import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "./customer.types";

const initialState: Customer = {
    id: "",
    points: 0,
    bags: 0,
    is_premium: false,
}

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<{
            id: string, points: number, bags: number,
            is_premium: boolean
        }>) => {
            state.id = action.payload.id;
            state.points = action.payload.points;
            state.bags = action.payload.bags;
            state.is_premium = action.payload.is_premium;
        },
        clearCustomer: (state) => {
            state = initialState
        },
        upgradeToPremium: (state) => {
            state.is_premium = true;
        },
        cancelPremium: (state) => {
            state.is_premium = false;
        },
    }
})

export const { setCustomer, clearCustomer, upgradeToPremium, cancelPremium } = customerSlice.actions
export const customerReducer = customerSlice.reducer
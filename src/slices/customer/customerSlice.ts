import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "./customer.types";

const initialState: Customer = {
    id: "",
    points: 0,
    bags_recycled: 0,
    is_premium: false,
    profile_picture: null,
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<Customer>) => {
            state.id = action.payload.id;
            state.points = action.payload.points;
            state.bags_recycled = action.payload.bags_recycled;
            state.is_premium = action.payload.is_premium;
            state.profile_picture = action.payload.profile_picture ?? null;
        },
        updateProfilePicture: (state, action: PayloadAction<string | null>) => {
            state.profile_picture = action.payload;
        },
        clearCustomer: () => initialState,
        upgradeToPremium: (state) => {
            state.is_premium = true;
        },
        cancelPremium: (state) => {
            state.is_premium = false;
        },
    }
})

export const { setCustomer, clearCustomer, upgradeToPremium, cancelPremium, updateProfilePicture } = customerSlice.actions
export const customerReducer = customerSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name: "requests",
    initialState: null,
    reducers: {
        addRequests: (state, action) => {
            return action.payload;
        }
    }
});

export default requestsSlice.reducer;
export const { addRequests } = requestsSlice.actions;
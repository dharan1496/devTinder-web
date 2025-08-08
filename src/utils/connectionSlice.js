import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connection",
    initialState: null,
    reducers: {
        addConnection: (state, action) => {
            return action.payload;
        }
    }
});

export default connectionSlice.reducer;
export const { addConnection } = connectionSlice.actions;
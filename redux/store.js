import { configureStore } from "@reduxjs/toolkit";
import { userRdcr } from "./reducers/userAuth_Reducer";


export const store = configureStore({
    reducer: {
        userRdcr
    

    },
    middleware:  (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        })

    }

})
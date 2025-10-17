import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js"
import messReducer from "./mess/messSlice.js"
import ownerReducer from "./mess/ownerMessSlice.js"


const store = configureStore({
    reducer:{
        auth: authReducer,

        mess: messReducer,

        owner: ownerReducer
    }
})


export default store;
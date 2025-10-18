import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js"
import messReducer from "./mess/messSlice.js"
import ownerReducer from "./mess/ownerMessSlice.js"
import requestReducer from "./mess/requestMessSlice.js"
import saveMessReducer from "./mess/saveMessSlice.js"


const store = configureStore({
    reducer:{
        auth: authReducer,

        mess: messReducer,

        owner: ownerReducer,

        request: requestReducer,

        save: saveMessReducer
    }
})


export default store;
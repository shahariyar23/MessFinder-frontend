import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js"
import messReducer from "./mess/messSlice.js"
import ownerReducer from "./mess/ownerMessSlice.js"
import requestReducer from "./mess/requestMessSlice.js"
import saveMessReducer from "./mess/saveMessSlice.js"
import bookingMessReducer from "./mess/bookingSlice.js"
import reviewReducer from "./mess/reviewSlice.js"
import adminReducer from "./admin/usersSlice.js"
import adminMessReducer from "./admin/adminMessSlice.js"


const store = configureStore({
    reducer:{
        auth: authReducer,

        mess: messReducer,

        owner: ownerReducer,

        request: requestReducer,

        save: saveMessReducer,

        booking: bookingMessReducer,

        review: reviewReducer,

        admin: adminReducer,
        
        adminMess: adminMessReducer
    }
})


export default store;
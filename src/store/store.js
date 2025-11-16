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
import adminPaymentReducer from "./admin/paymentSlice.js"
import adminBookingReducer from "./admin/bookingSlice.js"


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
        
        adminMess: adminMessReducer,

        adminPayment: adminPaymentReducer,

        adminBooking: adminBookingReducer
    }
})


export default store;
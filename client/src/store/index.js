import {configureStore} from '@reduxjs/toolkit'
import authSlice from './auth-slice.js'
import baseSlice from './base-slice.js'
import purchaseSlice from './purchase-slice.js'
import assignSlice from './assign-slice.js'


const store = configureStore({
    reducer:{
        authData:authSlice.reducer,
        baseData:baseSlice.reducer,
        purchaseData:purchaseSlice.reducer,
        assignData:assignSlice.reducer
    }
})

export default store


import {configureStore} from '@reduxjs/toolkit'
import authSlice from './auth-slice.js'
import baseSlice from './base-slice.js'


const store = configureStore({
    reducer:{
        authData:authSlice.reducer,
        baseData:baseSlice.reducer,
    }
})

export default store


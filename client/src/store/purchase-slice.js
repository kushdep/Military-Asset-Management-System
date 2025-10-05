import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
    name:'purchase',
    initialState:{
        data:null,
        pageState:'add',//history
        showAdAs:false
    },
    reducers:{
        setPageState(state,action){
            try {
                state.pageState = action.payload
            } catch (error) {
                console.log('Error in Sewt page State')
            }
        },
        setAddModalState(state,action){
            try {
                state.showAdAs = action.payload
            } catch (error) {
                console.log('Error in setAddModalState')
            }
        },
        
    }
})

export const purchaseActions = purchaseSlice.actions
export default purchaseSlice
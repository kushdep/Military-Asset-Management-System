import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState: {
        data: null,
        pageState: 'add',//history
        showAdAs: false,
        addNewPur: {
            oldAst: [],
            newAst: [],
            err: {
                newAstErr: [],
                oldAstErr: []
            }
        }
    },
    reducers: {
        setPageState(state, action) {
            try {
                state.pageState = action.payload
            } catch (error) {
                console.log('Error in Set page State'+error)
            }
        },
        setAddModalState(state, action) {
            try {
                state.showAdAs = action.payload
            } catch (error) {
                console.log('Error in setAddModalState'+error)
            }
        },
        addNewPurchase(state, action) {
            try {
                const { newAstVal } = action.payload
                state.addNewPur.newAst.push(newAstVal)
            } catch (error) {
                console.log('Error in addNewPurchase')
            }
        },
        incOldPurchase(state, action) {
            try {
                const { oldAstVal } = action.payload
                state.addNewPur.oldAst = oldAstVal
            } catch (error) {
                console.log('Error in addNewPurchase'+error)
            }
        },
        updErrState(state, action) {
            try {
                const { oldAstErr=null,newAstErr=null } = action.payload
                if(oldAstErr!==null){
                    state.addNewPur.err.oldAstErr=oldAstErr
                }
                if(newAstErr!==null){
                    state.addNewPur.err.newAstErr=newAstErr
                }
            } catch (error) {
                console.log('Error in addNewPurchase'+error)
            }
        }
    }
})

export const purchaseActions = purchaseSlice.actions
export default purchaseSlice
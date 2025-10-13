import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState: {
        data: null,
        pageState: '',//history
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
                console.error('Error in Set page State' + error)
            }
        },
        setAddModalState(state, action) {
            try {
                state.showAdAs = action.payload
            } catch (error) {
                console.error('Error in setAddModalState' + error)
            }
        },
        addNewPurchase(state, action) {
            try {
                const { newAstVal } = action.payload
                state.addNewPur.newAst.push(newAstVal)
            } catch (error) {
                console.error('Error in addNewPurchase'+error)
            }
        },
        delNewPurchase(state, action) {
            try {
                const { index } = action.payload
                state.addNewPur.newAst = state.addNewPur.newAst.filter((e, i) => index !== i)
            } catch (error) {
                console.error('Error in delNewPurchase'+error)
            }
        },
        addnewPurcDtl(state, action) {
            try {
                const { index, name = null, qty = null, type = null, metric = null } = action.payload
                if (name !== null) {
                    state.addNewPur.newAst[index].name = name
                }
                if (qty !== null) {
                    state.addNewPur.newAst[index].qty = qty
                }
                if (type !== null) {
                    state.addNewPur.newAst[index].type = type
                }
                if (metric !== null) {
                    state.addNewPur.newAst[index].metric = metric
                }
            } catch (error) {
                console.error("Error in addNewPurcDtl"+error)
            }
        },
        delIncOldPurchase(state, action) {
            try {
                const { id } = action.payload
                state.addNewPur.oldAst = state.addNewPur.oldAst.filter((e, i) => e._id !== id)

            } catch (error) {
                console.error('Error in addNewPurchase' + error)
            }
        },
        incOldPurchase(state, action) {
            try {
                const { oldAstVal } = action.payload
                state.addNewPur.oldAst.push(oldAstVal)
            } catch (error) {
                console.error('Error in addNewPurchase' + error)
            }
        },
        updOldPurchase(state, action) {
            try {
                const { oldAstVal, id } = action.payload
                state.addNewPur.oldAst = state.addNewPur.oldAst.map((e) => {
                    if (e._id === id) {
                        e = oldAstVal
                    }
                    return e
                })
            } catch (error) {
                console.error('Error in updOldPurchase' + error)
            }
        },
        updErrState(state, action) {
            try {
                const { oldAstErr = null, newAstErr = null } = action.payload
                if (oldAstErr !== null) {
                    state.addNewPur.err.oldAstErr = oldAstErr
                }
                if (newAstErr !== null) {
                    state.addNewPur.err.newAstErr = newAstErr
                }
            } catch (error) {
                console.error('Error in updErrState' + error)
            }
        },
        resetPurchaseData(state, action) {
            try {
                state.addNewPur.oldAst=[]
                state.addNewPur.newAst=[]
                state.addNewPur.err.oldAstErr = []
                state.addNewPur.err.newAstErr = []
            } catch (error) {
                console.error('Error in resetPurchaseData' + error)
            }
        }
    }
})

export const purchaseActions = purchaseSlice.actions
export default purchaseSlice
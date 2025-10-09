import { createSlice } from "@reduxjs/toolkit";

const transferSlice = createSlice({
    name: 'transfer',
    initialState: {
        pageState: 'transfer',//Approvals,history
        selBase: null,
        trnsfrAst: [],
        history: null
    },
    reducers: {
        setPageState(state, action) {
            try {
                state.pageState = action.payload
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setSelBase(state, action) {
            try {
                const { id, name } = action.payload
                console.log(action.payload)
                state.selBase = { id, name }
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setNewAssign(state, action) {
            try {
                const { id, qty, metric, type, name, selBaseId } = action.payload
                let ind = state.trnsfrAst.findIndex((e) => e.baseId === selBaseId)
                if (ind === -1) {
                    ind = state.trnsfrAst.length
                    state.trnsfrAst.push({ baseId: selBaseId, Vehicle: [], Ammunition: [], Weapons: [] })
                }
                state.trnsfrAst[ind][type].push({ id, qty, name, metric })
            } catch (error) {
                console.log('Error in setNewAssign' + error)
            }
        },
        delNewAssign(state, action) {
            try {
                const { id, type, sel } = action.payload
                const ind = state.trnsfrAst.findIndex((e) => e.baseId === sel)
                console.log(state.trnsfrAst[ind])
                state.trnsfrAst[ind][type] = state.trnsfrAst[ind][type].filter((e) => id !== e.id)
            } catch (error) {
                console.log('Error in delNewAssign' + error)
            }
        },
        updAsndAst(state, action) {
            try {
                const { id, qty, type, selBaseId } = action.payload
                const ind = state.trnsfrAst.findIndex((e) => e.baseId === selBaseId)
                state.trnsfrAst[ind][type] = state.trnsfrAst[ind][type].map((e) => {
                    if (e.id === id) {
                        e.qty = qty
                    }
                    return e
                })
            } catch (error) {
                console.log('Error in updAsndAst' + error)
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
                console.log('Error in addNewPurchase' + error)
            }
        },
        resetTfrAsgnData(state, action) {
            try {
                const { sel } = action.payload
                state.trnsfrAst = state.trnsfrAst.filter((e) => e.baseId !== sel)
            } catch (error) {
                console.log('Error in resetTfrAsgnData' + error)
            }
        }
    }
})

export const transferActions = transferSlice.actions
export default transferSlice
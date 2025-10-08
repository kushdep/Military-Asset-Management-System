import { createSlice } from "@reduxjs/toolkit";

const assignSlice = createSlice({
    name: 'purchase',
    initialState: {
        data: null,
        pageState: 'assign',//expenditure
        selSldr: null,
        asgnAst: [],
        asgnInvntry: null
    },
    reducers: {
        setAsgnInvnty(state, action) {
            try {
                const { invtry } = action.payload
                state.asgnInvntry = invtry
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        updAsgnInvnty(state, action) {
            try {
                const { id,type } = action.payload
                state.asgnInvntry = invtry
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setPageState(state, action) {
            try {
                state.pageState = action.payload
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setSelSldr(state, action) {
            try {
                const { id, name } = action.payload
                state.selSldr = { id, name }
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setNewAssign(state, action) {
            try {
                const { id, qty, metric, type, name, selSldrId } = action.payload
                let ind = state.asgnAst.findIndex((e) => e.sldrId === selSldrId)
                if (ind === -1) {
                    ind = state.asgnAst.length
                    state.asgnAst.push({ sldrId: selSldrId, Vehicle: [], Ammunition: [], Weapons: [] })
                }
                state.asgnAst[ind][type].push({ id, qty, name, metric })
            } catch (error) {
                console.log('Error in setNewAssign' + error)
            }
        },
        delNewAssign(state, action) {
            try {
                const { id, type, selSldrId } = action.payload
                const ind = state.asgnAst.findIndex((e) => e.sldrId === selSldrId)
                console.log(state.asgnAst[ind])
                state.asgnAst[ind][type] = state.asgnAst[ind][type].filter((e) => id !== e.id)
            } catch (error) {
                console.log('Error in delNewAssign' + error)
            }
        },
        updAsndAst(state, action) {
            try {
                const { id, qty, type, selSldrId } = action.payload
                const ind = state.asgnAst.findIndex((e) => e.sldrId === selSldrId)
                state.asgnAst[ind][type] = state.asgnAst[ind][type].map((e) => {
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
        resetAssgnData(state, action) {
            try {
                const { selSldrId } = action.payload
                state.asgnAst = state.asgnAst.filter((e) => e.sldrId !== selSldrId)
            } catch (error) {
                console.log('Error in resetAssgnData' + error)
            }
        }
    }
})

export const assignActions = assignSlice.actions
export default assignSlice
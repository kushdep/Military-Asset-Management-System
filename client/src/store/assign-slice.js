import { createSlice } from "@reduxjs/toolkit";

const assignSlice = createSlice({
    name: 'purchase',
    initialState: {
        data: null,
        pageState: 'assign',//expenditure
        selSldr: null,
        asgnAst: {
            Vehicle: [],
            Ammunition: [],
            Weapons: [],
        }
    },
    reducers: {
        setPageState(state, action) {
            try {
                state.pageState = action.payload
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setSelSldr(state, action) {
            try {
                const {id,name}=action.payload
                state.selSldr = {id,name}
            } catch (error) {
                console.log('Error in Set page State' + error)
            }
        },
        setNewAssign(state,action){
            try {
                const {id,qty,metric,type,name} = action.payload
                state.asgnAst[type].push({id,qty,name,metric})
            } catch (error) {
                console.log('Error in setNewAssign' + error)
            }
        },
        delNewAssign(state, action) {
            try {
                const { id,type } = action.payload
                state.asgnAst[type] = state.asgnAst[type].filter((e, i) => id !== e.id)
            } catch (error) {
                console.log('Error in delNewAssign')
            }
        },
        updAsndAst(state, action) {
            try {
                const { id,qty,type } = action.payload
                 state.asgnAst[type]  =  state.asgnAst[type].map((e) => {
                    if (e.id === id) {
                        e.qty = qty
                    }
                    return e
                })
            } catch (error) {
                console.log('Error in updOldPurchase' + error)
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
                state.addNewPur.oldAst = []
                state.addNewPur.newAst = []
                state.addNewPur.err.oldAstErr = []
                state.addNewPur.err.newAstErr = []
            } catch (error) {
                console.log('Error in addNewPurchase' + error)
            }
        }
    }
})

export const assignActions = assignSlice.actions
export default assignSlice
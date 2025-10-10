import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { itemType, months } from "../../config";

const baseSlice = createSlice({
    name: 'base',
    initialState: {
        baseIds: [],
        actvId: { id: 'BRAVO' },
        invtry: {},
        purchaseHistory: null,
        sldrsData: null,
        TINdata: null,
        TOUTdata: null,
        assignData: [],
        dashMetric: {
            openingBal: null,
            closingBal: null,
            NetMvmnt: null
        }
    },
    reducers: {
        addIds(state, action) {
            try {
                const { ids = [] } = action.payload
                state.baseIds = ids
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        setActId(state, action) {
            try {
                const { id = null, name = '' } = action.payload
                state.actvId = { id, name }
            } catch (error) {
                console.error("Error in setActId() " + error)
            }
        },
        setAssignData(state, action) {
            try {
                const { astAssignData } = action.payload
                console.log(astAssignData)
                state.assignData = astAssignData
            } catch (error) {
                console.error("Error in setAssignData() " + error)
            }
        },
        addInvtData(state, action) {
            try {
                const { invtry = null } = action.payload
                state.invtry = invtry
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        addTINData(state, action) {
            try {
                const { TINdata = [] } = action.payload
                state.TINdata = TINdata
                console.log(state.TINdata)
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        addTOUTData(state, action) {
            try {
                const { TOUTdata = [] } = action.payload
                state.TOUTdata = TOUTdata
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        addSldrData(state, action) {
            try {
                const { sldrsData = null } = action.payload
                console.log(sldrsData)
                state.sldrsData = sldrsData
                console.log(state.sldrsData)
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        addPurcData(state, action) {
            try {
                console.log(action.payload)
                const { purchsData } = action.payload
                console.log(purchsData)
                state.purchaseHistory = purchsData
                console.log(state.purchaseHistory)
            } catch (error) {
                console.error("Error in addPurcData() " + error)
            }
        },
        resetBaseData(state, action) {
            try {
                const { id = null } = action.payload
                state.actvId = id
                state.TINdata = []
                state.TOUTdata = []
                state.invtry = [],
                    state.purchsData = []
                state.sldrsData = []
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        setDashboardMetrics(state, action) {
            try {
                const { category, fromDate, toDate } = action.payload
                state.dashMetric.openingBal = calcOpeningBal(category, fromDate, state.invtry, state.TOUTdata, state.assignData, state.actvId)
                state.dashMetric.closingBal = calcClosingBal(category, fromDate, toDate)
                state.dashMetric.NetMvmnt = calcNetMvmntBal(category, fromDate, toDate)
            } catch (error) {
                console.error("Error in setDashboardMetrics() " + error)
            }
        }
    }
})

export const getBaseData = (token, id) => {
    return async (dispatch, getState) => {
        const getData = async () => {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/dashboard/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log(response)
            if (response.status === 400) {
                return {};
            }
            if (response.status === 500) {
                return {}
            };
            if (response.status === 200) {
                const resData = response.data.data
                return resData
            }
        }
        try {
            const baseData = await getData()
            console.log(baseData)
            if (Object.keys(baseData).length === 0) {
                dispatch(baseActions.resetBaseData({ id }))
                return
            }
            dispatch(baseActions.setActId({ id: baseData.baseId, name: baseData.baseName }))
            dispatch(baseActions.setAssignData({ astAssignData: baseData.asgnAst }))
            dispatch(baseActions.addInvtData({ invtry: baseData.inventory }))
            dispatch(baseActions.addTINData({ TINdata: baseData.tsfrAst.IN }))
            dispatch(baseActions.addTOUTData({ TOUTdata: baseData.tsfrAst.OUT }))
            dispatch(baseActions.addSldrData({ sldrsData: baseData.sldrs }))
            dispatch(baseActions.addPurcData({ purchsData: baseData.purchase }))
        } catch (error) {
            console.error("Error while Getting Data")
        }
    }
}

export const getBaseIds = (token) => {
    return async (dispatch, getState) => {
        const getIds = async () => {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/dashboard`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            if (response.status === 400) {
                return [];
            }
            if (response.status === 403) {
                return [];
            }
            if (response.status === 500) {
                return []
            };
            if (response.status === 200) {
                const resData = response.data.data
                return resData
            }
        }
        try {
            const ids = await getIds()
            console.log(ids)
            dispatch(baseActions.addIds({ ids }))
        } catch (error) {
            console.error("Error while Getting Data")
        }
    }
}

const calcOpeningBal = (fltrType, from, inventory, outAst, asgnAst, baseId) => {
    try {
        let openingBal = null
        const month = months[new Date(from).getMonth()];
        itemType.forEach(t => {
            if (fltrType !== 'all' && t.name !== fltrType) {
                return
            }
            openingBal = inventory[t.name].reduce((sum, inv) => sum + inv.OpeningBalQty[month], 0)
        });
        if (new Date(from).getDate() === 1) {
            return openingBal
        }
        const midOpnngBal = calcClosingBal(fltrType, `01-${new Date(from).getMonth()}-${new Date(from).getFullYear()}`, from, openingBal, outAst, asgnAst, baseId)
        if (!midOpnngBal) {
            return null
        }
        return midOpnngBal
    } catch (error) {
        console.log(error)
        return null
    }
}

const calcClosingBal = (fltrType, from, closingDate, opnngBal, outAst, asgnAst, baseId) => {
    try {
        let totalTout = 0
        let totalExpnd = 0
        itemType.forEach(t => {
            if (fltrType !== 'all' && t.name !== fltrType) {
                return
            }
            outAst.forEach((o) => {
                if (o.by !== baseId || o.status !== 'RECEIVED') {
                    return
                }
                totalTout = o.astDtl.reduce((sum, ast) => {
                    if (fltrType !== 'all' && ast.category !== fltrType) {
                        return 0
                    }
                    return sum + ast.totalQty.value
                }, totalTout)
            })
            asgnAst.forEach((a) => {
                if (a.baseId !== baseId._id) {
                    return
                }
                totalExpnd = a.items.forEach((item) => {
                    if (fltrType !== 'all' && item.category !== fltrType) {
                        return 0
                    }
                    item.expnd.reduce((sum,exp)=>sum+exp.qty.val,totalExpnd)
                    
                })
            })            
        });
    } catch (error) {
        console.log(error)
        return null
    }
}



export const baseActions = baseSlice.actions
export default baseSlice
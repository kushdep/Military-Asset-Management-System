import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseSlice = createSlice({
    name: 'base',
    initialState: {
        baseIds: [],
        actvId: {},
        invtry: {},
        purchsData: [],
        sldrsData: [],
        TINdata: [],
        TOUTdata: [],
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
                console.error("Error in addIds() " + error)
            }
        },
        addInvtData(state, action) {
            try {
                const { invtry = [] } = action.payload
                state.invtry = invtry
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        addTINData(state, action) {
            try {
                const { TINdata = [] } = action.payload
                state.TINdata = TINdata
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
                const { sldrsData = [] } = action.payload
                state.sldrsData = sldrsData
            } catch (error) {
                console.error("Error in addIds() " + error)
            }
        },
        addPurcData(state, action) {
            try {
                console.log(action.payload)
                const { purchsData = [] } = action.payload
                state.purchsData = purchsData
                console.log(state.purchsData)
            } catch (error) {
                console.error("Error in addIds() " + error)
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




export const baseActions = baseSlice.actions
export default baseSlice
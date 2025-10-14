import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {jwtDecode} from "jwt-decode"

const token = localStorage.getItem("token");

let baseId = null
let base_id = null

if (token) {
  try {
    const decoded = jwtDecode(token);
    baseId = decoded.baseId;
    base_id = decoded.base_id;
  } catch(error) {
    console.error("Error in hydration "+error)
  }
}

const baseSlice = createSlice({
  name: 'base',
  initialState: {
    baseIds: [],
    actvId: {id:baseId||'',base_id:base_id||''},
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
    },
    baseError:"",
    loading:false
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
        const { id, _id } = action.payload
        state.actvId.id = id
        state.actvId.base_id = _id
      } catch (error) {
        console.error("Error in setActId() " + error)
      }
    },
    setAssignData(state, action) {
      try {
        const { astAssignData } = action.payload
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
        state.sldrsData = sldrsData
      } catch (error) {
        console.error("Error in addIds() " + error)
      }
    },
    addPurcData(state, action) {
      try {
        const { purchsData } = action.payload
        state.purchaseHistory = purchsData
      } catch (error) {
        console.error("Error in addPurcData() " + error)
      }
    },
    resetBaseData(state, action) {
      try {
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
        const { opening, closing, netMovement } = action.payload
        state.dashMetric.openingBal = opening
        state.dashMetric.closingBal = closing
        state.dashMetric.NetMvmnt = netMovement
      } catch (error) {
        console.error("Error in setDashboardMetrics() " + error)
      }
    },
    setErrorState(state, action) {
      try {
        const { errMsg } = action.payload
        state.baseError = errMsg
      } catch (error) {
        console.error("Error in setErrorState"+error)
      }
    },
    setLoadingState(state, action) {
      try {
        const { isLoading } = action.payload
        state.loading = isLoading
      } catch (error) {
        console.error("Error in setLoadingState"+error)
      }
    }
  }
})

export const getBaseData = (token, id) => {
  return async (dispatch, getState) => {
    const getData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/dashboard/${id}`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
      if (response.status === 200) {
        const resData = response.data.data
        return resData
      } 
      if (response.status === 204) {
        return {}
      } 
        
      } catch (error) {
      if (error?.response.status === 400) {
      dispatch(baseActions.setErrorState({errMsg:'BAD REQUEST'}))
      return {};
    }
      if (error?.response.status === 401) {
      dispatch(baseActions.setErrorState({errMsg:'BAD REQUEST'}))
      return {};
    }
      if (error?.response.status === 403) {
      dispatch(baseActions.setErrorState({errMsg:'Unauthorized'}))
      return {};
    }
    if (error?.response.status === 500) {
        dispatch(baseActions.setErrorState({errMsg:'Something went wrong'}))
        return {}
      };
      }
    }
    try {
      const baseData = await getData()
      if (Object.keys(baseData).length === 0) {
        return
      }
      dispatch(baseActions.setActId({ id: baseData.baseId, _id: baseData._id }))
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
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/dashboard`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const resData = response.data.data
          return resData
        }
        
      } catch (error) {
        if (error?.response.status === 400) {
          dispatch(baseActions.setErrorState({errMsg:'BAD REQUEST'}))
          return [];
        }
        if (error?.response.status === 401) {
          dispatch(baseActions.setErrorState({errMsg:'BAD REQUEST'}))
          return [];
        }
        if (error?.response.status === 403) {
          dispatch(baseActions.setErrorState({errMsg:'BAD REQUEST'}))
          return [];
        }
        if (error?.response.status === 500) {
          dispatch(baseActions.setErrorState({errMsg:'Something went wrong'}))
          return []
        };
      }
    }
    try {
      const ids = await getIds()
      dispatch(baseActions.addIds({ ids }))
    } catch (error) {
      console.error("Error while Getting Data")
    }
  }
}



export const baseActions = baseSlice.actions
export default baseSlice
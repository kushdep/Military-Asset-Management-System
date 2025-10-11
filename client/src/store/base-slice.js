import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { itemType, months } from "../../config";

const baseSlice = createSlice({
    name: 'base',
    initialState: {
        baseIds: [],
        actvId: {},
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
                const { id = null,_id='' } = action.payload
                state.actvId = { id, name,_id }
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
                state.dashMetric.closingBal = calcClosingBal(category, fromDate, toDate, state.dashMetric.openingBal, assignData, state.actvId)
                state.dashMetric.NetMvmnt = calcNetMvmntBal(category, fromDate, toDate, purchaseHistory, state.TOUTdata, state.assignData, state.actvId)
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
    let openingBal = 0;
    const dateObj = new Date(from);
    const month = months[dateObj.getMonth()];
    const isFirstDay = dateObj.getDate() === 1;

    itemType.forEach((t) => {
      if (fltrType !== "all" && t.name !== fltrType) return;
      if (!inventory[t.name]) return;

      const sum = inventory[t.name].reduce(
        (total, inv) => total + (inv.OpeningBalQty?.[month] || 0),
        0
      );
      openingBal += sum;
    });

    if (isFirstDay) return openingBal;

    const m = dateObj.getMonth() + 1;
    const y = dateObj.getFullYear();
    const firstDate = `01-${m}-${y}`;

    const midOpnngBal = calcClosingBal(
      fltrType,
      firstDate,
      from,
      openingBal,
      outAst,
      asgnAst,
      baseId
    );

    return midOpnngBal ?? null;
  } catch (error) {
    console.error("calcOpeningBal error:", error);
    return null;
  }
};


const calcClosingBal = (fltrType, from, closingDate, opnngBal, outAst, asgnAst, baseId) => {
  try {
    let totalTout = 0;
    let totalExpnd = 0;
    const fromEpch = new Date(from);
    const clsngEpch = new Date(closingDate);

    itemType.forEach((t) => {
      if (fltrType !== "all" && t.name !== fltrType) return;

      outAst.forEach((o) => {
        if (
          o.by === baseId &&
          o.status === "RECEIVED" &&
          new Date(o.TOUTdate) >= fromEpch &&
          new Date(o.TOUTdate) <= clsngEpch
        ) {
          totalTout += o.astDtl.reduce((sum, ast) => {
            if (fltrType !== "all" && ast.category !== fltrType) return sum;
            return sum + (ast.totalQty?.value || 0);
          }, 0);
        }
      });

      asgnAst.forEach((a) => {
        if (a.baseId !== baseId._id) return;

        totalExpnd += a.items.reduce((sum, item) => {
          if (fltrType !== "all" && item.category !== fltrType) return sum;

          const expSum = item.expnd.reduce((expTotal, exp) => {
            const expDate = new Date(exp.expndDate);
            if (expDate >= fromEpch && expDate <= clsngEpch) {
              return expTotal + (exp.qty?.value || 0);
            }
            return expTotal;
          }, 0);

          return sum + expSum;
        }, 0);
      });
    });

    return opnngBal - totalTout - totalExpnd;
  } catch (error) {
    console.error("calcClosingBal error:", error);
    return null;
  }
};


const calcNetMvmntBal = (fltrType, from, to, purchaseList, inAst, outAst, baseId) => {
  try {
    const fromEpch = new Date(from);
    const toEpch = new Date(to);
    let totalPur = 0;
    let totalTout = 0;
    let totalTin = 0;

    purchaseList.forEach((p) => {
      if (p.base !== baseId._id) return;
      if (p.date && (new Date(p.date) < fromEpch || new Date(p.date) > toEpch)) return;

      totalPur += p.items.reduce((sum, item) => {
        if (fltrType !== "all" && item.asset.type !== fltrType) return sum;
        return sum + (item.qty || 0);
      }, 0);
    });

    outAst.forEach((o) => {
      if (
        o.by === baseId &&
        o.status === "RECEIVED" &&
        new Date(o.TOUTdate) >= fromEpch &&
        new Date(o.TOUTdate) <= toEpch
      ) {
        totalTout += o.astDtl.reduce((sum, ast) => {
          if (fltrType !== "all" && ast.category !== fltrType) return sum;
          return sum + (ast.totalQty?.value || 0);
        }, 0);
      }
    });

    inAst.forEach((i) => {
      if (
        i.to === baseId &&
        i.status === "RECEIVED" &&
        new Date(i.TINdate) >= fromEpch &&
        new Date(i.TINdate) <= toEpch
      ) {
        totalTin += i.astDtl.reduce((sum, ast) => {
          if (fltrType !== "all" && ast.category !== fltrType) return sum;
          return sum + (ast.totalQty?.value || 0);
        }, 0);
      }
    });

    return totalPur + totalTin - totalTout;
  } catch (error) {
    console.error("calcNetMvmntBal error:", error);
    return null;
  }
};



export const baseActions = baseSlice.actions
export default baseSlice
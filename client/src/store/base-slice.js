import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseSlice = createSlice({
    name: 'base',
    initialState: {
        baseIds: [],
        baseData: [],
        filter: {
            guestCap: null,
            priceRange: {
                ind: null,
                range: ''
            }
        },

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
    }
})

export const getBaseIds = (token) => {
    return async (dispatch, getState) => {
        const getIds = async () => {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/dashboard`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            if (response.status === 204) {
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
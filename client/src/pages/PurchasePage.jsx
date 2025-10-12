import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBaseData } from "../store/base-slice";
import { purchaseActions } from "../store/purchase-slice";
import AddNewPurchase from "../components/AddNewPurchase";
import PurchaseHistoryTable from "../components/PurchaseHistory";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function PurchasePage() {
  const { data, pageState } = useSelector((state) => state.purchaseData);
  const { baseError } = useSelector((state) => state.baseData);
  const { token,role } = useSelector((state) => state.authData);
  const {id} = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    if (data === null) {
      console.log("inside");
      dispatch(getBaseData(token, id));
    } 
      if(pageState==='' && role!=='COM'){
    dispatch(purchaseActions.setPageState('add'))
  }else{
    dispatch(purchaseActions.setPageState('history'))
  }
  }, []);

  // if(baseError!==null){
  //   toast.error(error)
  //   return 
  // }


    
  return (
    <>
      <div className="container-fluid h-100">
        <div className="row mt-3 h-100">
          <div className="col-1 d-flex flex-column gap-3 me-3">
            {role!=='COM'&&
            <button
              className={`btn fw-bold ${
                pageState === "add" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={()=>dispatch(purchaseActions.setPageState('add'))}
              >
              ADD
            </button>}
            <button
              className={`btn fw-bold ${
                pageState === "history" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={()=>dispatch(purchaseActions.setPageState('history'))}
            >
              History
            </button>
          </div>
          <div className="col">
            {
              pageState==='add' && role!=='COMM'?
                <AddNewPurchase/>:<PurchaseHistoryTable/>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchasePage;

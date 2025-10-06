import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBaseData } from "../store/base-slice";
import { purchaseActions } from "../store/purchase-slice";
import AddNewPurchase from "../components/AddNewPurchase";
import PurchaseHistoryTable from "../components/PurchaseHistory";
import { useParams } from "react-router-dom";

function PurchasePage() {
  const { data, pageState } = useSelector((state) => state.purchaseData);
  const { token } = useSelector((state) => state.authData);
  const {id} = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    if (data === null) {
      console.log("inside");
      dispatch(getBaseData(token, id));
    } else {
      //call for particular base dashboard
    }
  }, []);
    
  return (
    <>
      <div className="container-fluid h-100">
        <div className="row mt-3 h-100">
          <div className="col-1 d-flex flex-column gap-3 justify-content-center me-3">
            <button
              className={`btn fw-bold ${
                pageState === "add" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={()=>dispatch(purchaseActions.setPageState('add'))}
              >
              ADD
            </button>
            <button
              className={`btn fw-bold ${
                pageState === "history" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={()=>dispatch(purchaseActions.setPageState('history'))}
            >
              History
            </button>
          </div>
          <div className="col">
            {
              pageState==='add'?
                <AddNewPurchase/>:<PurchaseHistoryTable/>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchasePage;

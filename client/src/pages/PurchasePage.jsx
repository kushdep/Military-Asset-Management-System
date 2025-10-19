import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseActions, getBaseData } from "../store/base-slice";
import { purchaseActions } from "../store/purchase-slice";
import AddNewPurchase from "../components/AddNewPurchase";
import PurchaseHistoryTable from "../components/PurchaseHistory";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function PurchasePage() {
  const { data, pageState } = useSelector((state) => state.purchaseData);
  const { baseError,actvId } = useSelector((state) => state.baseData);
  const { token, role } = useSelector((state) => state.authData);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!token && !localStorage.getItem('token')){
      navigate("/login");
      console.log("Return bcs of token")
      return;
    }
    console.log("token"+token)
    
    if (data === null) {
      const baseIdToUse = id ?? actvId?.id;
      if (!baseIdToUse) {
        navigate("/login");
        return;
      }
      console.log("sending Req")
      console.log("sending Req token"+ token)
      dispatch(getBaseData(token, baseIdToUse));
    }

    if (pageState === "" && role !== "COM") {
      dispatch(purchaseActions.setPageState("add"));
    } else {
      dispatch(purchaseActions.setPageState("history"));
    }
  }, [token]);

  if (baseError !== "") {
    toast.error(baseError);
    dispatch(baseActions.setErrorState({ errMsg: "" }));
  }

  return (
    <div className="container-fluid py-3 h-100">
      <div className="row h-100">
        <div
          className="
            col-12 col-md-2
            d-flex flex-md-column flex-row
            justify-content-md-start justify-content-around
            align-items-center
            gap-2 gap-md-3
            mb-3 mb-md-0
          "
        >
          {role !== "COM" && (
            <button
              className={`btn fw-bold w-100 ${
                pageState === "add" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => dispatch(purchaseActions.setPageState("add"))}
            >
              ADD
            </button>
          )}

          <button
            className={`btn fw-bold w-100 ${
              pageState === "history" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => dispatch(purchaseActions.setPageState("history"))}
          >
            History
          </button>
        </div>

        <div className="col-12 col-md-10">
          {pageState === "add" && role !== "COMM" ? (
            <AddNewPurchase />
          ) : (
            <PurchaseHistoryTable />
          )}
        </div>
      </div>
    </div>
  );
}

export default PurchasePage;

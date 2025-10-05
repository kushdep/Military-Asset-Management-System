import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import toast from "react-hot-toast";
import { getBaseData } from "../store/base-slice";
import { useParams } from "react-router-dom";
import purchaseSlice, { purchaseActions } from "../store/purchase-slice";
import AddNewPurchase from "../components/AddNewPurchase";
import PurchaseHistory from "../components/PurchaseHistory";

function PurchasePage() {
  const { invtry } = useSelector((state) => state.baseData);
  const { data, pageState } = useSelector((state) => state.purchaseData);
  const { token } = useSelector((state) => state.authData);

  let sno = 1;
  const [filter, setFilter] = useState({
    type: "",
    date: { fromDate: "", toDate: "" },
  });

  const fromInp = useRef();
  const toInp = useRef();
  const dispatch = useDispatch();
  const { id } = useParams();

  function setTypeFilter(typeVal) {
    setFilter((prev) => {
      if (typeVal === "NF") {
        return { ...prev, type: "" };
      }
      return { ...prev, type: typeVal };
    });
  }

  useEffect(() => {
    if (data === null) {
      console.log("inside");
      dispatch(getBaseData(token, id));
    } else {
      //call for particular base dashboard
    }
  }, []);

  function setDateFilter() {
    const to = new Date(toInp.current.value).getTime();
    const from = new Date(fromInp.current.value).getTime();
    if (from > to) {
      toast.error("Choose valid dates");
      toInp.current.value = "";
      fromInp.current.value = "";
      return;
    }

    setFilter((prev) => {
      return {
        ...prev,
        date: {
          fromDate: fromInp.current.value,
          toDate: toInp.current.value,
        },
      };
    });
  }
  console.log(filter);
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
                <AddNewPurchase/>:<PurchaseHistory/>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchasePage;

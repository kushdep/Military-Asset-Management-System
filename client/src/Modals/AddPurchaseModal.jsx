import { createPortal } from "react-dom";
import AddNewAsset from "../components/AddNewAsset";
import { useDispatch, useSelector } from "react-redux";
import { purchaseActions } from "../store/purchase-slice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { getBaseData } from "../store/base-slice";

function AddPurchaseModal({ reference }) {
  const { addNewPur, showAdAs } = useSelector((state) => state.purchaseData);
  const { token } = useSelector((state) => state.authData);
  const { actvId } = useSelector((state) => state.baseData);
  const { id } = useParams();
  const dispatch = useDispatch();

  function chkFields() {
    let newPurErr = [];
    if (addNewPur.newAst.length > 0) {
      for (const [ind, val] of addNewPur.newAst.entries()) {
        let message = "";
        if (
          val.name === "" ||
          val.qty === null ||
          val.metric === "NS" ||
          val.type === "NS"
        ) {
          if (val.name === "") message += " name";
          if (val.qty === null) message += " Qty";
          if (val.metric === "NS") message += " metric";
          if (val.type === "NS") message += " type";
          newPurErr.push({ ind, message });
        }
      }
    }

    if (newPurErr.length > 0) {
      dispatch(purchaseActions.updErrState({ newAstErr: newPurErr }));
    } else {
      dispatch(purchaseActions.updErrState({ newAstErr: [] }));
    }
    reference.current.close();
  }

  async function addNewPurchase() {
    const body = { ...addNewPur };

    try {
      const baseIdToUse = id ?? actvId.id;

      const response = await axios.post(
        `https://military-asset-management-system-68gp.onrender.com/dashboard/${baseIdToUse}/new-purchase`,
        body,
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("New Purchases Added Successfully");
        dispatch(purchaseActions.resetPurchaseData());
        dispatch(getBaseData(token, id));
        reference.current.close();
      }
    } catch (error) {
      toast.error("Failed to add new purchase");
      if (error?.response.status === 400) {
        toast.error("Bad Request");
      }
      if (error?.response.status === 401) {
        toast.error("Permission Denied");
      }
      if (error?.response.status === 400) {
        toast.error("Unauthorize");
      }
      if (error?.response.status === 500) {
        toast.success("Something went wrong");
      }
    }
  }

  return createPortal(
    <dialog
      ref={reference}
      className="shadow rounded-4 p-3 p-sm-4 w-100 w-sm-75 w-md-50"
      style={{
        maxWidth: "90vw",
        border: "none",
        overflowY: "auto",
        maxHeight: "85vh",
      }}
    >
      <form method="dialog" className="d-flex justify-content-end mb-2">
        <button
          type="submit"
          className="btn-close"
          aria-label="Close"
          onClick={chkFields}
        ></button>
      </form>

      {showAdAs ? (
        <div className="container-fluid">
          {addNewPur.oldAst.length > 0 && (
            <>
              <p className="fw-bold fs-5 text-center mb-3 text-secondary">
                Old Assets
              </p>
              <div className="row g-2">
                {addNewPur.oldAst.map((iv) => (
                  <div key={iv._id} className="col-12">
                    <div className="border rounded-3 p-2 p-md-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                      <p className="fw-semibold mb-1">{iv.name}</p>
                      <small className="text-muted">
                        Qty: {iv.qty} {iv.metric}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {addNewPur.newAst.length > 0 && (
            <>
              <p className="fw-bold fs-5 text-center mt-3 text-secondary">
                New Assets
              </p>
              <div className="row g-2">
                {addNewPur.newAst.map((iv) => (
                  <div key={iv._id} className="col-12">
                    <div className="border rounded-3 p-2 p-md-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                      <p className="fw-semibold mb-1">{iv.name}</p>
                      <small className="text-muted">
                        Qty: {iv.qty} {iv.metric}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="overflow-auto" style={{ maxHeight: "50vh" }}>
                {addNewPur.newAst.length !== 0 &&
                  addNewPur.newAst.map((e, i) => {
                    const val = addNewPur.err.newAstErr?.find(
                      (er) => er.ind === i
                    );
                    return (
                      <AddNewAsset
                        key={i}
                        errMsg={val?.message}
                        addBloc={e}
                        index={i}
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          {addNewPur.newAst.length < 4 && (
            <div className="d-flex justify-content-center mt-2">
              <button
                className="btn border-0 w-75 w-sm-50 btn-light"
                onClick={() => {
                  const addNewRow = {
                    name: "",
                    type: "",
                    metric: "",
                    qty: null,
                  };
                  dispatch(
                    purchaseActions.addNewPurchase({ newAstVal: addNewRow })
                  );
                }}
              >
                {addNewPur.newAst.length === 0 ? "+ Add" : "+ Add More"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-3">
        <button
          className={`btn w-75 w-sm-50 fw-semibold rounded-pill shadow-sm ${
            showAdAs ? "btn-success" : "btn-outline-success"
          }`}
          onClick={showAdAs ? addNewPurchase : chkFields}
        >
          {showAdAs ? "Submit" : "Done"}
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default AddPurchaseModal;

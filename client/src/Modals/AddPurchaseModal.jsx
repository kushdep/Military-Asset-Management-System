import { createPortal } from "react-dom";
import AddNewAsset from "../components/AddNewAsset";
import { useDispatch, useSelector } from "react-redux";
import purchaseSlice, { purchaseActions } from "../store/purchase-slice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function AddPurchaseModal({ reference }) {
  const { addNewPur, showAdAs } = useSelector((state) => state.purchaseData);
  const { token } = useSelector((state) => state.authData);
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
          if (val.name === "") {
            message += " name";
          }
          if (val.qty === null) {
            message += " Qty";
          }
          if (val.metric === "NS") {
            message += " metric";
          }
          if (val.type === "NS") {
            message += " type";
          }
          newPurErr.push({ ind, message });
        }
      }
    }

    if (newPurErr.length > 0) {
      dispatch(purchaseActions.updErrState({ newAstErr: newPurErr }));
    }
    reference.current.close();
  }

  async function addNewPurchase() {
    const body = {
      ...addNewPur,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/dashboard/${id}/new-purchase`,
      body,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 400) {
      toast.error('Bad Gateway')
      return 
    }
    if (response.status === 500) {
      toast.error('Something went wrong')
      return 
    }
    if (response.status === 200) {
      toast.success('New Purchases Added Successfully')
      dispatch(purchaseActions.resetPurchaseData())
      reference.current.close()
      return 
    }
  }

  return createPortal(
    <dialog ref={reference} className=" shadow rounded-4 p-4 ">
      <form method="dialog" className="d-flex gap-5">
        <button
          type="submit"
          className="btn-close mb-3"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={chkFields}
        ></button>
      </form>
      {showAdAs ? (
        <div className="container p-2">
          <div className="row">
            <div className="col">
              {addNewPur.oldAst.length > 0 && (
                <p className="fw-bolder fs-4 text-center">Old Assets</p>
              )}
              {addNewPur.oldAst.length > 0 &&
                addNewPur.oldAst.map((iv) => {
                  return (
                    <div className="container">
                      <div className="row">
                        <div className="col border rounded-3">
                          <div
                            key={iv._id}
                            className="d-flex flex-row justify-content-between"
                          >
                            <p className="fw-semibold mb-1" name="assetName">
                              {iv.name}
                            </p>
                            <small className="text-muted">
                              Qty : {iv.qty} {iv.metric}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {addNewPur.newAst.length > 0 && (
                <p className="fw-bolder fs-4 text-center mt-2">New Assets</p>
              )}
              {addNewPur.newAst.length > 0 &&
                addNewPur.newAst.map((iv) => {
                  return (
                    <div className="container mt ">
                      <div className="row">
                        <div className="col border rounded-3">
                          <div
                            key={iv._id}
                            className="p-3 mb-3 d-flex align-items-center justify-content-between"
                          >
                            <div>
                              <p className="fw-bold mb-1" name="assetName">
                                {iv.name}
                              </p>
                            </div>
                            <small className="text-muted">
                              Qty : {iv.qty} {iv.metric}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="container p-2">
          <div className="row">
            <div className="col">
              <div className="modal-dialog-scrollable">
                <div className="container mb-3 ">
                  <div className="row">
                    <div className="col">
                      {addNewPur.newAst.length !== 0 &&
                        addNewPur.newAst.map((e, i) => {
                          const val = addNewPur.err.newAstErr?.find(
                            (e) => e.ind === i
                          );
                          console.log(val?.message);
                          return (
                            <AddNewAsset
                              errMsg={val?.message}
                              addBloc={e}
                              index={i}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {addNewPur.newAst.length < 4 && (
            <div className="d-flex justify-content-center">
              <button
                className="btn border-0 w-50"
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
                {addNewPur.newAst.length === 0 ? "+ Add" : " + Add more"}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="text-center">
        <button
          className={`btn w-50 fw-semibold rounded-pill shadow-sm mt-2 ${
            showAdAs ? "btn-success" : "btn-outline-success"
          }`}
          onClick={showAdAs ? addNewPurchase : chkFields}
        >
          {showAdAs ? "Submit" : "DONE"}
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default AddPurchaseModal;

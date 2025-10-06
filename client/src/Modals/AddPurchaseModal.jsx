import { createPortal } from "react-dom";
import AddNewAsset from "../components/AddNewAsset";
import { useDispatch, useSelector } from "react-redux";
import { purchaseActions } from "../store/purchase-slice";

function AddPurchaseModal({ reference }) {
  const { addNewPur, showAdAs } = useSelector((state) => state.purchaseData);
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
    console.log(newPurErr);
    if (newPurErr.length > 0) {
      dispatch(purchaseActions.updErrState({ newAstErr: newPurErr }));
    }
    reference.current.close();
  }

  console.log(addNewPur);
  return createPortal(
    <dialog ref={reference} className=" shadow rounded-4 p-4">
      <form method="dialog" className="d-flex gap-5">
        <button
          type="submit"
          className="btn-close mb-3"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={chkFields}
        ></button>
        <h3>Add Purchased Assets</h3>
      </form>

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
                          <AddNewAsset errMsg={val?.message} addBloc={e} />
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
              {addNewPur.newAst.length===0?'+ Add':' + Add more'}
            </button>
          </div>
        )}
      </div>
      <div className="text-center">
        <button
          className={`btn w-50 fw-semibold rounded-pill shadow-sm mt-2 ${
            showAdAs ? "btn-success" : "btn-outline-success"
          }`}
          onClick={showAdAs ? addPurhase : chkFields}
          //   disabled={asgnAst[actvAsst.name].length === 0}
        >
          {showAdAs ? "ADD NEW PURCHASE" : "DONE"}
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default AddPurchaseModal;

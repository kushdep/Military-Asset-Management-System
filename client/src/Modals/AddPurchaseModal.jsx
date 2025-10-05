import { createPortal } from "react-dom";
import AddNewAsset from "../components/AddNewAsset";
import { useSelector } from "react-redux";

function AddPurchaseModal({ reference }) {
  const { showAdAs } = useSelector((state) => state.purchaseData);

  return createPortal(
    <dialog ref={reference} className=" shadow rounded-4 p-4">
      <form method="dialog" className="d-flex gap-5">
        <button
          type="submit"
          className="btn-close mb-3"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        <h3>Add Purchased Assets</h3>
      </form>

      <div className="container p-2 border">
        <div className="row">
          <div className="col">
            <div className="modal-dialog-scrollable">
              <div className="container mb-3 ">
                <div className="row">
                  <div className="col">
                    <AddNewAsset />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn border-0 w-50">+ Add more</button>
        </div>
      </div>
      <div className="text-center">
        <button
          className={`btn w-50 fw-semibold rounded-pill shadow-sm mt-2 ${
            showAdAs ? "btn-success" : "btn-outline-success"
          }`}
          //   onClick={AddAsgnData}
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

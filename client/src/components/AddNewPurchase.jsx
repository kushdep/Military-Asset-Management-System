import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import useFilter from "../hooks/useFilter";
import { getBaseData } from "../store/base-slice";
import { useParams } from "react-router-dom";
import AddPurchaseModal from "../Modals/AddPurchaseModal";
import { purchaseActions } from "../store/purchase-slice";
import toast from "react-hot-toast";
import AssetTypeBtnGroup from "./AssetTypeBtnGroup";

function AddNewPurchase() {
  const { invtry } = useSelector((state) => state.baseData);
  const { addNewPur } = useSelector((state) => state.purchaseData);
  const { token } = useSelector((state) => state.authData);
  const { assetType, handleAssetType } = useFilter({ code: "VCL", name: "Vehicle" });
  const { id } = useParams();
  const addNewRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!token && !localStorage.getItem('token') && localStorage.getItem('token')!==''){
      navigate("/login");
      return;
    }

    if (Object.keys(invtry).length === 0) {
      const baseIdToUse = id ?? actvId?.id;
       if (!baseIdToUse) {
        navigate("/login");
        return;
      }
      getBaseData(token, baseIdToUse);
    }
  }, [token]);

  const metricInd = itemType.findIndex((e) => e.code === assetType.code);

  const handleSubmit = (e, id, type, name, isExstng = false) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get("assetQty");
    const metric = formData.get("metric");

    if (value < 1) return toast.error("Enter Valid Qty");
    if (metric === "NS") return toast.error("Enter Valid Metric");

    const oldAstVal = { _id: id, name, type, qty: value, metric };

    if (isExstng) {
      dispatch(purchaseActions.updOldPurchase({ oldAstVal, id }));
      toast.success("Value updated");
    } else {
      dispatch(purchaseActions.incOldPurchase({ oldAstVal }));
    }
  };

  return (
    <div className="container-fluid border-start border-black p-3">
      <div className="row mb-3 align-items-center">
        <div className="col-12 col-lg-6">
          <div className="btn-group d-flex flex-wrap gap-2" role="group">
            <AssetTypeBtnGroup fun={handleAssetType} val={assetType.code} />
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col d-flex flex-wrap justify-content-between gap-2">
          <AddPurchaseModal reference={addNewRef} />
          <button
            className="btn btn-secondary flex-grow-1 flex-sm-grow-0"
            onClick={() => {
              dispatch(purchaseActions.setAddModalState(false));
              addNewRef.current.showModal();
            }}
          >
            + New
          </button>

          {(addNewPur.newAst.length > 0 || addNewPur.oldAst.length > 0) &&(
              <button
                className="btn fw-bold text-success text-decoration-underline flex-grow-1 flex-sm-grow-0"
                onClick={() => {
                  dispatch(purchaseActions.setAddModalState(true));
                  addNewRef.current.showModal();
                }}
              >
                See Added Assets
              </button>
            )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          {invtry[assetType.name]?.map((iv) => {
            const { oldAst } = addNewPur;
            let exstng = false;
            let ind = -1;

            if (oldAst.length !== 0) {
              ind = oldAst.findIndex((e) => e._id === iv.asset._id);
              if (ind > -1) exstng = true;
            }

            return (
              <form
                key={iv.asset._id}
                onSubmit={(e) =>
                  handleSubmit(e, iv.asset._id, assetType.code, iv.asset.name, exstng)
                }
                className="border rounded-3 p-3 mb-3"
              >
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div className="flex-grow-1">
                    <p className="fw-bold mb-1">{iv.asset.name}</p>
                    <small className="text-muted">
                      Available Qty: {iv.qty.value} {iv.qty.metric}
                    </small>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <input
                      type="number"
                      name="assetQty"
                      className="form-control form-control-sm"
                      style={{ maxWidth: "100px" }}
                      defaultValue={ind !== -1 && oldAst[ind].qty}
                      required
                    />

                    <select className="form-select form-select-sm" name="metric">
                      {itemType[metricInd].metrics.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>

                    <button className="btn btn-success btn-sm" type="submit">
                      {exstng ? "Save" : "Add"}
                    </button>

                    {exstng && (
                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() =>
                          dispatch(purchaseActions.delIncOldPurchase({ id: iv.asset._id }))
                        }
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AddNewPurchase;

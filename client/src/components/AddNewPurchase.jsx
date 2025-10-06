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
  const {  addNewPur } = useSelector((state) => state.purchaseData);
  const { token } = useSelector((state) => state.authData);
  const { assetType, handleAssetType } = useFilter({code:'VCL',name:'Vehicle'});
  const { id } = useParams();
  const addNewRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(invtry).length === 0) {
      getBaseData(token, id);
    }
  }, []);

  const metricInd = itemType.findIndex((e) => e.code === assetType.code);
  const handleSubmit = (e, id, type, name,isExstng = false) => {
    console.log(e);
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get("assetQty");
    const metric = formData.get("metric");
    if (value < 1) {
      toast.error("Enter Valid Qty");
      return;
    }
    if (metric === "NS") {
      toast.error("Enter Valid Metric");
      return;
    }
    let oldAstVal = {
      _id: id,
      name,
      type,
      qty: value,
      metric,
    };
    console.log(oldAstVal);
    if (isExstng) {
      dispatch(purchaseActions.updOldPurchase({ oldAstVal, id }));
      toast.success("Value updated");
    } else {
      dispatch(purchaseActions.incOldPurchase({ oldAstVal }));
    }
    return;
  };

  console.log(addNewPur.oldAst);
  return (
    <div className="container-fluid border-start border-black">
      <div className="row">
        <div className="col">
          <div className="container p-0 w-50">
            <div className="row mb-2">
              <div className="col btn-group gap-1" role="group">
                <AssetTypeBtnGroup fun={handleAssetType} val={assetType.code}/>
              </div>
            </div>
          </div>
          <div className="row p-0">
            <div className="col d-flex justify-content-between">
              <AddPurchaseModal reference={addNewRef} />
              <button
                className="btn btn-secondary"
                onClick={() => {
                  dispatch(purchaseActions.setAddModalState(false));
                  addNewRef.current.showModal();
                }}
              >
                + New
              </button>
              {(addNewPur.newAst.length > 0 ||
                addNewPur.oldAst.length > 0) &&
                  (addNewPur.err.newAstErr.length === 0 && (
                    <button
                      className="btn fw-bold text-success text-decoration-underline"
                      onClick={() => {
                        dispatch(purchaseActions.setAddModalState(true));
                        addNewRef.current.showModal();
                      }}
                    >
                      See Added Assets
                    </button>
                  ))}
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              {invtry[assetType.name]?.map((iv) => {
                const { oldAst } = addNewPur;

                let exstng = false;
                if (oldAst.length !== 0) {
                  let ind = oldAst.findIndex((e) => e._id === iv._id);
                  if (ind > -1) {
                    exstng = true;
                  }
                }
                console.log(iv._id);
                return (
                  <form
                    onSubmit={(e) =>
                      handleSubmit(e, iv.asset._id, assetType.code, iv.asset.name,exstng)
                    }
                  >
                    <div
                      key={iv.asset._id}
                      className="border rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
                    >
                      <div>
                        <p className="fw-bold mb-1" name="assetName">{iv.asset.name}</p>
                      </div>
                      <small className="text-muted">
                        Available Qty : {iv.qty.value} {iv.qty.metric}
                      </small>

                      <div className="form-floating ms-3 d-flex flex-row gap-2">
                        <input
                          type="number"
                          name="assetQty"
                          className="rounded-3 w-25"
                        />
                        <div className="form-floating">
                          <select className="form-select" name="metric">
                            {itemType[metricInd].metrics.map((i) => {
                              return (
                                <option key={i} value={i.code}>
                                  {i}
                                </option>
                              );
                            })}
                          </select>
                          <label className="p-2">metric</label>
                        </div>
                        <button
                          className="btn btn-primary"
                          type="submit"
                        >
                          {exstng ? "Save" : "Add"}
                        </button>
                      </div>
                    </div>
                  </form>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewPurchase;

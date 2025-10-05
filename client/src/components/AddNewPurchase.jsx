import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import useFilter from "../hooks/useFilter";
import { getBaseData } from "../store/base-slice";
import { useParams } from "react-router-dom";
import AddPurchaseModal from "../Modals/AddPurchaseModal";
import { purchaseActions } from "../store/purchase-slice";

function AddNewPurchase() {
  const { invtry } = useSelector((state) => state.baseData);
  const { assetType, handleAssetType } = useFilter();
  const { token } = useSelector((state) => state.authData);
  const { id } = useParams();
  const addNewRef = useRef();
  const dispatch = useDispatch()

  useEffect(() => {
    if (Object.keys(invtry).length === 0) {
      getBaseData(token, id);
    }
  }, []);

  const metricInd = itemType.findIndex((e) => e.code === assetType.code);
  console.log(id);
  console.log(assetType);
  console.log(invtry);

  return (
    <div className="container-fluid border-start border-black">
      <div className="row">
        <div className="col">
          <div className="container p-0 w-50">
            <div className="row mb-2">
              <div className="col btn-group gap-1" role="group">
                {itemType.map((item, ind) => (
                  <button
                    key={ind}
                    type="button"
                    className={`btn fw-bold ${
                      assetType.code === item.code
                        ? `btn-primary`
                        : `btn-outline-primary`
                    }`}
                    onClick={() => handleAssetType(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="row p-0">
            <div className="col d-flex justify-content-between">
              <AddPurchaseModal reference={addNewRef} />
              <button
                className="btn btn-secondary"
                onClick={() =>{
                dispatch(purchaseActions.setAddModalState(false))
                addNewRef.current.showModal()}}
                >
                + New
              </button>
              <button className="btn fw-bold text-success text-decoration-underline"
                onClick={()=>{
                    dispatch(purchaseActions.setAddModalState(true))
                    addNewRef.current.showModal()}}
              >
                See Added Assets
              </button>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              {invtry[assetType.name]?.map((iv) => {
                return (
                  <div
                    key={iv._id}
                    className="border rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
                  >
                    <div>
                      <p className="fw-bold mb-1">{iv.asset.name}</p>
                    </div>
                    <small className="text-muted">
                      Available Qty : {iv.qty.value} {iv.qty.metric}
                    </small>

                    <div className="form-floating ms-3 d-flex flex-row gap-2">
                      <input type="number" className="w-50 rounded-3" />
                      <div
                        className="form-floating ms-3"
                        style={{ width: "120px" }}
                      >
                        <select className="form-select">
                          {itemType[metricInd].metrics.map((i) => {
                            return (
                              <option key={i} value={i}>
                                {i}
                              </option>
                            );
                          })}
                        </select>
                        <label>Qty</label>
                      </div>
                      <button className="btn btn-primary">Add</button>
                    </div>
                  </div>
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

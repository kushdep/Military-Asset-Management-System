import { useDispatch } from "react-redux";
import { itemType } from "../../config";
import { purchaseActions } from "../store/purchase-slice";
import { useState } from "react";

const AddNewAsset = ({ index, addBloc = null, errMsg = null }) => {
  const metric = itemType.flatMap((ele) => ele.metrics.map((m) => m));
  const [isEdit, setIsEdit] = useState(
    Object.values(addBloc).some((e) => e === "") ? false : true
  );
  const dispatch = useDispatch();

  return (
    <div
      className={`container-fluid ${isEdit ? "bg-light" : ""} border p-2 rounded-3 mt-2`}
    >
      {errMsg && <p className="text-danger fs-6">{`Invalid ${errMsg}`}</p>}

      <div className="row g-2">
        <div className="col-12 col-md-9">
          <div className="d-flex flex-column flex-md-row gap-2">
            <div className="form-floating flex-fill">
              <input
                type="text"
                className="form-control"
                id="assetName"
                placeholder="Asset Name"
                disabled={isEdit}
                name="assetName"
                onChange={(e) => {
                  dispatch(
                    purchaseActions.addnewPurcDtl({
                      index,
                      name: e.target.value,
                    })
                  );
                }}
                value={addBloc.name}
              />
              <label htmlFor="assetName">Asset Name</label>
            </div>

            <div className="form-floating flex-fill">
              <select
                className="form-select"
                id="assetType"
                name="assetType"
                disabled={isEdit}
                onChange={(e) => {
                  dispatch(
                    purchaseActions.addnewPurcDtl({
                      index,
                      type: e.target.value,
                    })
                  );
                }}
                value={addBloc.type}
              >
                <option value="NS">Select Type</option>
                {itemType.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
              <label htmlFor="assetType">Type</label>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 mt-2">
            <div className="form-floating flex-fill">
              <input
                type="number"
                className="form-control"
                name="assetQty"
                id="assetQty"
                placeholder="Quantity"
                disabled={isEdit}
                onChange={(e) => {
                  dispatch(
                    purchaseActions.addnewPurcDtl({
                      index,
                      qty: e.target.value,
                    })
                  );
                }}
                value={addBloc.qty}
              />
              <label htmlFor="assetQty">Quantity</label>
            </div>

            <div className="form-floating flex-fill">
              <select
                className="form-select"
                id="assetMetric"
                name="assetMetric"
                disabled={isEdit}
                onChange={(e) => {
                  dispatch(
                    purchaseActions.addnewPurcDtl({
                      index,
                      metric: e.target.value,
                    })
                  );
                }}
                value={addBloc.metric}
              >
                <option value="NS">Select metric</option>
                {metric.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <label htmlFor="assetMetric">Metric</label>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3 d-flex flex-column flex-md-column gap-2 justify-content-md-center align-items-md-start mt-2 mt-md-0">
          <button
            className="btn btn-dark flex-fill"
            onClick={() => setIsEdit(!isEdit)}
            disabled={Object.values(addBloc).some((e) => e === "" || e === "NS")}
          >
            {isEdit ? "Edit" : "Add"}
          </button>

          <button
            className="btn btn-danger flex-fill"
            onClick={() => dispatch(purchaseActions.delNewPurchase({ index }))}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAsset;

import { useDispatch } from "react-redux";
import { itemType } from "../../config";
import { useActionState } from "react";
import { purchaseActions } from "../store/purchase-slice";

const AddNewAsset = ({ addBloc, errMsg = null }) => {
  const metric = itemType.flatMap((ele) => ele.metrics.map((m) => m));
  const dispatch = useDispatch();
  const [formStt, formAcn] = useActionState(action, {
    name: "",
    qty: null,
    metric: "NS",
    type: "NS",
    err: "",
  });

  function action(prevState, formStt) {
    const assetName = formStt.get("asset");
    const assetType = formStt.get("assetType");
    const qty = formStt.get("assetQty");
    const assetMetric = formStt.get("assetMetric");

    let message = "";

    if (assetName === "") {
      message += " name";
    }
    if (qty === null) {
      message += " Qty";
    }
    if (assetMetric === "NS") {
      message += " metric";
    }
    if (assetType === "NS") {
      message += " type";
    }

    if (message !== "") {
      return {
        name: assetName,
        qty,
        type: assetType,
        metric: assetMetric,
        err: message,
      };
    }

    let newAstVal = {
      name: assetName,
      qty,
      type: assetType,
      metric: assetMetric,
    };
    dispatch(purchaseActions.addNewPurchase({ newAstval }));
    return {
      name: assetName,
      qty,
      type: assetType,
      metric: assetMetric,
    };
  }

  return (
    <div className="container-fluid border p-2 rounded-3 mt-2">
      <form action={formAcn}>
        <div className="row">
          <div className="col-9">
            {formStt.err !== "" && (
              <p className="text-danger fs-6">Invalid {formStt.err}</p>
            )}
            <div className="d-flex flex-row gap-2">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="assetName"
                  placeholder="Asset Name"
                  name="asset"
                  // value={addBloc.name || ''}
                />
                <label htmlFor="assetName">Asset Name</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  id="assetType"
                  name="assetType"
                  // value={addBloc.type || ''}
                >
                  <option value="NS">Select Type</option>
                  {itemType.map((t) => (
                    <option value={t}>{t.name}</option>
                  ))}
                </select>
                <label htmlFor="assetType">Type</label>
              </div>
            </div>
            <div className="d-flex flex-row gap-2 mt-2">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  name="assetQty"
                  id="assetQty"
                  placeholder="Quantity"
                  // value={addBloc.qty || ''}
                />
                <label htmlFor="assetQty">Quantity</label>
              </div>

              <div className="form-floating">
                <select
                  className="form-select"
                  id="assetMetric"
                  name="assetMetric"
                  // value={addBloc.metric || ''}
                >
                  <option value="NS">Select metric</option>
                  {metric.map((e) => {
                    return <option value={e}>{e}</option>;
                  })}
                </select>
                <label htmlFor="assetMetric">Metric</label>
              </div>
            </div>
          </div>
          <div className="col-3 d-flex flex-column gap-1 justify-content-center">
            <button className="btn btn-dark" disabled={errMsg !== null}>
              Add
            </button>
            {<button className="btn btn-danger">Remove</button>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewAsset;

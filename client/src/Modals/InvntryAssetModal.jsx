import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import useFilter from "../hooks/useFilter";

function InvntryAssetModal({
  reference,
  submitfun,
  selField,
  asgnData,
  delAsgnDataFn,
  keyName,
}) {
  const { invtry } = useSelector((state) => state.baseData);
  const { assetType, handleAssetType } = useFilter({
    code: "VCL",
    name: "Vehicle",
  });
  const dispatch = useDispatch();

  return createPortal(
    <dialog
      ref={reference}
      className="w-100 w-md-75 w-lg-50 p-3 p-md-4 rounded-4 shadow border-0"
      style={{ maxWidth: "700px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">{selField?.name}</h3>
        <button
          type="button"
          className="btn-close"
          onClick={() => reference.current.close()}
          aria-label="Close"
        ></button>
      </div>

      <div className="mb-3 overflow-auto">
        <div className="btn-group flex-nowrap">
          {itemType.map((item, ind) => (
            <button
              key={ind}
              type="button"
              className={`btn fw-bold ${
                assetType.code === item.code ? `btn-success` : `btn-outline-success`
              }`}
              onClick={() => handleAssetType(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="modal-dialog-scrollable" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {invtry?.[assetType.name]?.map((iv) => {
          const ind = asgnData.findIndex((e) => e[keyName] === selField.id);
          const exstAstAsnd = ind > -1 ? asgnData[ind][assetType.name] : [];
          const exstngVal = exstAstAsnd.find((i) => i.id === iv.asset._id);
          const exstng = !!exstngVal;

          const ttlAsnd = asgnData
            .flatMap((sldr) => sldr[assetType.name])
            .filter((a) => a.id === iv.asset._id)
            .reduce((sum, a) => sum + Number(a.qty), 0);

          const availableQty = iv.qty.value - ttlAsnd + (Number(exstngVal?.qty) || 0);
          if (availableQty <= 0) return null;

          return (
            <div
              key={iv._id}
              className="border rounded-3 p-3 mb-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3"
            >
              <div className="flex-grow-1">
                <p className="fw-bold mb-1">{iv.asset.name}</p>
                <small className="text-muted">
                  Available: {availableQty} {iv.qty.metric}
                </small>
              </div>

              <form
                className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2"
                onSubmit={(e) =>
                  submitfun(
                    e,
                    iv.qty.metric,
                    iv.asset._id,
                    iv.asset.name,
                    assetType.name,
                    exstng ?? false
                  )
                }
              >
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="assetQty"
                    defaultValue={exstngVal?.qty ?? ""}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: availableQty }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <label>Qty</label>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button type="submit" className="btn btn-success">
                    {exstng ? "Save" : "Add"}
                  </button>
                  {exstng && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        dispatch(
                          delAsgnDataFn({
                            id: iv.asset._id,
                            type: assetType.name,
                            sel: selField.id,
                          })
                        )
                      }
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-3">
        <button
          className="btn w-50 fw-semibold btn-primary rounded-pill shadow-sm"
          onClick={() => reference.current.close()}
        >
          Done
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default InvntryAssetModal;

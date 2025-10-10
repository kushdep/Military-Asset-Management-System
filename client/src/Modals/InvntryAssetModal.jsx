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
    <dialog ref={reference} className="w-50 shadow rounded-4 p-4">
      <form method="dialog" className="d-flex gap-5">
        <button
          type="submit"
          className="btn-close mb-3"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        <h3>{selField?.name}</h3>
      </form>

      <div className="container p-0">
        <div className="row mb-2">
          <div className="col btn-group" role="group">
            {itemType.map((item, ind) => (
              <button
                key={ind}
                type="button"
                className={`btn fw-bold ${
                  assetType.code === item.code
                    ? `btn-success`
                    : `btn-outline-success`
                }`}
                onClick={() => handleAssetType(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="modal-dialog-scrollable">
              <div className="container border mb-3 rounded-4 shadow-sm">
                <div className="row d-flex justify-content-center">
                  <div className="col p-3">
                    {invtry?.[assetType.name]?.map((iv) => {
                      const ind = asgnData.findIndex(
                        (e) => {
                            return e[keyName] === selField.id
                        }
                      );
                      console.log(ind);
                      const exstAstAsnd = ind > -1 ? asgnData[ind][assetType.name] : [];
                      console.log(exstAstAsnd);

                      const exstngVal = exstAstAsnd.find(
                        (i) => i.id === iv._id
                      );
                      console.log(exstngVal);
                      const exstng = !!exstngVal;

                      const ttlAsnd = asgnData
                        .flatMap((sldr) => sldr[assetType.name])
                        .filter((a) => a.id === iv._id)
                        .reduce((sum, a) => sum + Number(a.qty), 0);
                      console.log(ttlAsnd);
                      const availableQty =
                        iv.qty.value - ttlAsnd + (Number(exstngVal?.qty) || 0);
                      console.log(availableQty);

                      if (availableQty <= 0) return null;

                      return (
                        <div
                          key={iv._id}
                          className="border rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
                        >
                          <div>
                            <p className="fw-bold mb-1">{iv.asset.name}</p>
                            <small className="text-muted">
                              Available: {availableQty} {iv.qty.metric}
                            </small>
                          </div>

                          <form
                            onSubmit={(e) =>
                              submitfun(
                                e,
                                iv.qty.metric,
                                iv._id,
                                iv.asset.name,
                                assetType.name,
                                exstng ?? false
                              )
                            }
                          >
                            <div className="form-floating ms-3">
                              <select
                                className="form-select"
                                name="assetQty"
                                defaultValue={exstngVal?.qty ?? ""}
                              >
                                <option value="">Select</option>
                                {Array.from(
                                  { length: availableQty },
                                  (_, i) => i + 1
                                ).map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                              <label>Qty</label>
                            </div>

                            <div className="d-flex flex-column gap-1">
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
                                        id: iv._id,
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

                  <div className="text-center">
                    <button
                      className="btn w-50 fw-semibold btn-primary rounded-pill shadow-sm mb-3"
                      onClick={() => reference.current.close()}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default InvntryAssetModal;

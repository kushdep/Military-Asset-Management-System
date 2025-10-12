import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import toast from "react-hot-toast";
import useFilter from "../hooks/useFilter";
import { assignActions } from "../store/assign-slice";

function AssignmentModal({ reference }) {
  const { invtry } = useSelector((state) => state.baseData);
  const { selSldr, asgnAst } = useSelector((state) => state.assignData);
  const { assetType, handleAssetType } = useFilter({
    code: "VCL",
    name: "Vehicle",
  });
  const dispatch = useDispatch();

  function submitAsndAst(event, metric, id, name, isExstng) {
    event.preventDefault();
    const data = new FormData(event.target);
    const qty = data.get("assetQty");
    if (!qty) {
      toast.error("Select Qty to Assign");
      return;
    }
    if (isExstng) {
      dispatch(
        assignActions.updAsndAst({
          selSldrId: selSldr.id,
          id,
          qty,
          type: assetType.name,
        })
      );
      toast.success("Saved");
    } else {
      dispatch(
        assignActions.setNewAssign({
          selSldrId: selSldr.id,
          id,
          name,
          metric,
          qty,
          type: assetType.name,
        })
      );
    }
  }

  return createPortal(
    <dialog
      ref={reference}
      className="w-100 max-w-md p-3 p-md-4 rounded-4 shadow"
      style={{ maxWidth: "700px" }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h3 className="mb-2 mb-md-0 text-center text-md-start">{selSldr?.name}</h3>
        <button
          type="button"
          className="btn-close align-self-end"
          onClick={() => reference.current.close()}
        ></button>
      </div>

      <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
        {itemType.map((item, ind) => (
          <button
            key={ind}
            type="button"
            className={`btn fw-bold ${
              assetType.code === item.code ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => handleAssetType(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div
        className="overflow-auto"
        style={{ maxHeight: "350px" }}
      >
        <div className="row g-3">
          {invtry?.[assetType.name]?.map((iv) => {
            const ind = asgnAst.findIndex((e) => e.sldrId === selSldr.id);
            const exstSldrAstAsnd = ind > -1 ? asgnAst[ind][assetType.name] : [];
            const exstngVal = exstSldrAstAsnd.find((i) => i.id === iv.asset._id);
            const exstng = !!exstngVal;

            const ttlAsnd = asgnAst
              .flatMap((sldr) => sldr[assetType.name])
              .filter((a) => a.id === iv.asset._id)
              .reduce((sum, a) => sum + Number(a.qty), 0);

            const availableQty = iv.qty.value - ttlAsnd + (Number(exstngVal?.qty) || 0);
            if (availableQty <= 0) return null;

            return (
              <div
                key={iv._id}
                className="col-12 col-sm-6 col-md-4 d-flex flex-column gap-2 border rounded-3 p-3"
              >
                <div>
                  <p className="fw-bold mb-1">{iv.asset.name}</p>
                  <small className="text-muted">
                    Available: {availableQty} {iv.qty.metric}
                  </small>
                </div>

                <form
                  onSubmit={(e) =>
                    submitAsndAst(e, iv.qty.metric, iv.asset._id, iv.asset.name, exstng)
                  }
                  className="d-flex flex-column gap-2"
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

                  <div className="d-flex flex-column gap-2">
                    <button type="submit" className="btn btn-success">
                      {exstng ? "Save" : "Add"}
                    </button>
                    {exstng && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          dispatch(
                            assignActions.delNewAssign({
                              id: iv.asset._id,
                              type: assetType.name,
                              selSldrId: selSldr.id,
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
      </div>

      <div className="text-center mt-3">
        <button
          className="btn w-100 w-md-50 fw-semibold btn-primary rounded-pill shadow-sm"
          onClick={() => reference.current.close()}
        >
          Done
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default AssignmentModal;

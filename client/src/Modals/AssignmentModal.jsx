import { useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { itemType } from "../../config";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

function AssignmentModal({ reference, sldr }) {
  const { invtry } = useSelector((state) => state.baseData);
  const [actvAsst, setactvAsst] = useState({ code: "VCL", name: "Vehicle" });
  const [asgnAst, setAsgnAst] = useState({
    Vehicle: [],
    Ammunition: [],
    Weapons: [],
  });
  console.log(sldr)
    const {id} = useParams()
  const [selectedQty, setSelectedQty] = useState({});

  async function AddAsgnData() {
    const asgnAstData = Object.values(asgnAst).flatMap((arr) =>
      arr.map((item) => ({ astId: item.id, qty: item.qty,asndDate: new Date()}))
    );

    const body = {
      sldrId: sldr.id,
      asgnAstIds:asgnAstData,
    };
    console.log(body);
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${id}/assign-asset`,
        body,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200) {
        toast.success('Asset Assigned Successfully')
      }
      if(response.status === 400) {
        toast.error('Something went wrong')
        return 
      }
    } catch (error) {
       if (error.response.status === 500) {
        toast.error("Something went wrong");
      }
      return 
    }
    reference.current.close();
  }
  console.log(asgnAst);

  return createPortal(
    <dialog ref={reference} className="w-50 shadow rounded-4 p-4">
      <form method="dialog" className="d-flex gap-5">
        <button
          type="submit"
          className="btn-close mb-3"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        <h3>{sldr?.name}</h3>
      </form>

      <div className="container p-0">
        <div className="row mb-2">
          <div className="col btn-group" role="group">
            {itemType.map((item, ind) => (
              <button
                key={ind}
                type="button"
                className={`btn fw-bold ${
                  actvAsst.code === item.code
                    ? `btn-success`
                    : `btn-outline-success`
                }`}
                onClick={() => setactvAsst(item)}
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
                    {invtry[actvAsst.name]?.map((iv) => {
                      const exstng = asgnAst[actvAsst.name].some(
                        (i) => i.id === iv._id
                      );
                      console.log(exstng);
                      return (
                        <div
                          key={iv._id}
                          className="border rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
                        >
                          <div>
                            <p className="fw-bold mb-1">{iv.name}</p>
                            <small className="text-muted">
                              Qty: {iv.qty} {iv.metric}
                            </small>
                          </div>

                          <div
                            className="form-floating ms-3"
                            style={{ width: "120px" }}
                          >
                            <select
                              className="form-select"
                              value={selectedQty[iv._id] || ""}
                              onChange={(e) =>
                                setSelectedQty((prev) => ({
                                  ...prev,
                                  [iv._id]: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select</option>
                              {Array.from(
                                { length: iv.qty },
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
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => {
                                if (!selectedQty[iv._id]) {
                                  toast.error(
                                    "Please select a quantity before adding."
                                  );
                                  return;
                                }

                                setAsgnAst((prev) => ({
                                  ...prev,
                                  [actvAsst.name]: [
                                    ...prev[actvAsst.name],
                                    {
                                      id: iv._id,
                                      name: iv.name,
                                      qty: Number(selectedQty[iv._id]),
                                    },
                                  ],
                                }));
                              }}
                            >
                              {exstng ? "Save" : "Add"}
                            </button>

                            {exstng && (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                  setAsgnAst((prev) => ({
                                    ...prev,
                                    [actvAsst.name]: prev[actvAsst.name].filter(
                                      (item) => item.id !== iv._id
                                    ),
                                  }));
                                  setSelectedQty((prev) => {
                                    const updated = { ...prev };
                                    delete updated[iv._id];
                                    return updated;
                                  });
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <button
                      className="btn w-50 fw-semibold btn-primary rounded-pill shadow-sm mb-3"
                      onClick={AddAsgnData}
                      disabled={asgnAst[actvAsst.name].length === 0}
                    >
                      Assign
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

export default AssignmentModal;

import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import toast from "react-hot-toast";
import useFilter from "../hooks/useFilter";
import { assignActions } from "../store/assign-slice";
import { useState } from "react";
import { useParams } from "react-router-dom";

function ExpendAssetModal({ reference }) {
  const { assignData } = useSelector((state) => state.baseData);
  const { selSldr, expndAst } = useSelector((state) => state.assignData);
  const [listModalStt, setModalStt] = useState("");
  const { assetType, handleAssetType } = useFilter({
    code: "VCL",
    name: "Vehicle",
  });
  const dispatch = useDispatch();
  const baseId = useParams()

  function submitExpAst(event, metric, itemId, name, isExstng) {
    event.preventDefault();
    const data = new FormData(event.target);
    const qty = data.get("assetQty");
    if (qty === null || qty === "") {
      toast.error("Select Qty to Assign");
      return;
    }
    if (isExstng) {
      dispatch(
        assignActions.updExpended({
          asgmtId: listModalStt,
          itemId,
          qty,
        })
      );
      toast.success("Saved");
    } else {
      dispatch(
        assignActions.setNewExpended({
          asgmtId: listModalStt,
          itemId,
          metric,
          name,
          qty,
        })
      );
    }
  }

  let assignList = null;
  let assetList = null;
  if (selSldr !== null) {
    assignList = assignData.filter((f) => f.sId === selSldr.id);
  }

  if (listModalStt !== "") {
    assetList = assignData.filter((a) => a._id === listModalStt);
  }

  async function submitExpendedAssets() {
    const body = {
      sldrId: id,
      asgnAst: { Vehicle, Ammunition, Weapons },
    };
    console.log(body);
    try {
      console.log(baseId);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${baseId}/assign-asset`,
        body,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Asset Assigned Successfully");
        dispatch(assignActions.resetAssgnData({ selSldrId: id }));
        dispatch(getBaseData(token, baseId));
      }
      if (response.status === 400) {
        toast.error("Assignment Not possible");
        return;
      }
    } catch (error) {
      if (error.response.status === 500) {
        toast.error("Something went wrong");
      }
      return;
    }
  }

  console.log(listModalStt);
  console.log(assignData);
  console.log(assignList);
  console.log(assetList);
  console.log(expndAst);

  return createPortal(
    <dialog ref={reference} className="w-50 shadow rounded-4 p-4">
      <div className="d-flex flex-row justify-content-between mb-3">
        <button
          className="btn btn-light"
          onClick={() => {
            if (listModalStt !== "") {
              if (expndAst.length > 0) {
                dispatch(assignActions.resetExpndnData());
              }
              setModalStt("");
            } else {
              reference.current.close();
            }
          }}
        >
          {listModalStt !== "" ? "Back" : "close"}
        </button>
        {expndAst.length > 0 && (
          <button
            className="btn text-success fw-bold text-decoration-underline"
            onClick={() => setModalStt("all")}
          >
            Selected Assets
          </button>
        )}
      </div>
      <div className="container"></div>

      {listModalStt === "" ? (
        <div className="container ">
          <div className="row d-flex flex-column ">
            {assignList !== null &&
              assignList.map((a) => {
                const createdTime = new Date(a.createdAt).toISOString();
                const timeStamp =
                  createdTime.slice(0, 10) + " , " + createdTime.slice(11, 19);
                return (
                  <div className="col d-flex gap-5 border rounded-2 mb-2 p-2 justify-content-center">
                    <p className="fw-bold">{a.sId}</p>
                    <div className="d-flex gap-2">
                      <p className="text-muted">({timeStamp})</p>
                    </div>
                    <button
                      className="btn btn-warning"
                      onClick={() => setModalStt(a._id)}
                    >
                      See
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="container p-0">
          <div className="row mb-3">
            {listModalStt !== "" && assetList.length > 0 && (
              <div className="text-center">
                <h3 className="">{assetList[0].sId}</h3>
                <p className="text-muted">
                  {new Date(assetList[0].createdAt).toISOString().slice(0, 10)}{" "}
                  (
                  {new Date(assetList[0].createdAt).toISOString().slice(11, 19)}
                  )
                </p>
              </div>
            )}
          </div>
          {listModalStt === "all" ? (
            <div className="container">
              <div className="row d-flex flex-column gap-3">
                {expndAst[0].items.map((e) => {
                  return (
                    <div className="col border p-2 rounded-3 d-flex justify-content-around">
                      <p className="fw-bold">{e.name}</p>
                      <p className="text-muted">
                        {e.qty}
                        {e.metric}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="text-center">
                    <button
                      className="btn w-50 fw-semibold btn-outline-danger rounded-pill shadow-sm mb-3"
                      onClick={submitExpendedAssets}
                    >
                      Expend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
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
                    <div className="container  mb-3 rounded-4">
                      <div className="row d-flex justify-content-center">
                        <div className="col p-3">
                          {assetList.length !== 0 &&
                            assetList[0].items.map((it) => {
                              if (it.category !== assetType.name) {
                                return;
                              }

                              const ind = expndAst.findIndex(
                                (e) => e.asgmtId === listModalStt
                              );
                              console.log(ind);
                              let exstng = false;
                              if (ind > -1) {
                                exstng = expndAst[ind].items.find(
                                  (i) => i.itemId === it._id
                                );
                                console.log(exstng);
                              }

                              return (
                                <div
                                  key={it._id}
                                  className="border rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
                                >
                                  <div>
                                    <p className="fw-bold mb-1">{it.name}</p>
                                    <small className="text-muted">
                                      Assigned: {it.totalQty.value}{" "}
                                      {it.totalQty.metric}
                                    </small>
                                  </div>

                                  <form
                                    onSubmit={(e) =>
                                      submitExpAst(
                                        e,
                                        it.totalQty.metric,
                                        it._id,
                                        it.name,
                                        exstng ?? false
                                      )
                                    }
                                  >
                                    <div className="form-floating ms-3">
                                      <select
                                        className="form-select"
                                        name="assetQty"
                                        defaultValue={exstng?.qty || ""}
                                      >
                                        <option value="">Select</option>
                                        {Array.from(
                                          { length: it.totalQty.value },
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
                                        type="submit"
                                        className="btn btn-success"
                                      >
                                        {exstng ? "Save" : "Add"}
                                      </button>
                                      {exstng && (
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          onClick={() =>
                                            dispatch(
                                              assignActions.delNewAssign({
                                                id: iv._id,
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default ExpendAssetModal;

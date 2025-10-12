import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import toast from "react-hot-toast";
import useFilter from "../hooks/useFilter";
import { assignActions } from "../store/assign-slice";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getBaseData } from "../store/base-slice";

function ExpendAssetModal({ reference }) {
  const { assignData } = useSelector((state) => state.baseData);
  const { token } = useSelector((state) => state.authData);
  const { selSldr, expndAst } = useSelector((state) => state.assignData);
  const [listModalStt, setModalStt] = useState("");
  const { assetType, handleAssetType } = useFilter({
    code: "VCL",
    name: "Vehicle",
  });
  const dispatch = useDispatch();
  const { id: baseId } = useParams();

  function submitExpAst(event, metric, itemId, name, isExstng) {
    event.preventDefault();
    const data = new FormData(event.target);
    const qty = data.get("assetQty");
    if (!qty) {
      toast.error("Select Qty to Assign");
      return;
    }
    if (isExstng) {
      dispatch(assignActions.updExpended({ asgmtId: listModalStt, itemId, qty }));
      toast.success("Saved");
    } else {
      dispatch(assignActions.setNewExpended({ asgmtId: listModalStt, itemId, metric, name, qty }));
    }
  }

  let assignList = selSldr ? assignData.filter((f) => f.sId === selSldr.id) : [];
  let assetList = listModalStt ? assignData.filter((a) => a._id === listModalStt) : [];

  async function submitExpendedAssets() {
    const body = { asgmtId: expndAst[0].asgmtId, items: expndAst[0].items };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${baseId}/expend-asset`,
        body,
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Asset Expended Successfully");
        setModalStt("");
        dispatch(assignActions.resetExpndnData());
        dispatch(getBaseData(token, baseId));
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return createPortal(
    <dialog
      ref={reference}
      className="w-100 w-md-75 w-lg-50 p-3 p-md-4 rounded-4 shadow"
      style={{ maxWidth: "700px" }}
    >
      <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
        <button
          className="btn btn-light"
          onClick={() => {
            if (listModalStt !== "") {
              if (expndAst.length > 0) dispatch(assignActions.resetExpndnData());
              setModalStt("");
            } else reference.current.close();
          }}
        >
          {listModalStt !== "" ? "Back" : "Close"}
        </button>
        {expndAst.length > 0 && listModalStt !== "all" && (
          <button
            className="btn text-success fw-bold text-decoration-underline"
            onClick={() => setModalStt("all")}
          >
            Selected Assets
          </button>
        )}
      </div>

      {listModalStt === "" ? (
        <div className="container">
          <div className="row g-2">
            {assignList.map((a) => {
              const createdTime = new Date(a.items[0].asgnDate);
              const timeStamp =
                createdTime.toLocaleDateString() + " , " + createdTime.toLocaleTimeString();
              return (
                <div
                  key={a._id}
                  className="col-12 d-flex flex-column flex-md-row gap-3 border rounded-2 p-2 align-items-center justify-content-between"
                >
                  <p className="fw-bold mb-1 mb-md-0">{a.sId}</p>
                  <p className="text-muted mb-1 mb-md-0">({timeStamp})</p>
                  <button className="btn btn-warning" onClick={() => setModalStt(a._id)}>
                    See
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="container p-0">
          {assetList.length > 0 && (
            <div className="text-center mb-3">
              <h3>{assetList[0].sId}</h3>
              <p className="text-muted">
                {new Date(assetList[0].items[0].asgnDate).toLocaleDateString()} (
                {new Date(assetList[0].items[0].asgnDate).toLocaleTimeString()})
              </p>
            </div>
          )}

          {listModalStt === "all" ? (
            <div className="row g-2">
              {expndAst[0].items.map((e) => (
                <div key={e.itemId} className="col-12 col-sm-6 border p-2 rounded-3 d-flex justify-content-between">
                  <p className="fw-bold mb-0">{e.name}</p>
                  <p className="text-muted mb-0">
                    {e.qty}
                    {e.metric}
                  </p>
                </div>
              ))}
              <div className="col-12 text-center mt-3">
                <button
                  className="btn w-50 fw-semibold btn-outline-danger rounded-pill shadow-sm"
                  onClick={submitExpendedAssets}
                >
                  Expend
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
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

              <div
                className="container overflow-auto"
                style={{ maxHeight: "300px" }}
              >
                <div className="row g-2">
                  {assetList[0].items
                    .filter((it) => it.category === assetType.name && it.totalQty.value > 0)
                    .map((it) => {
                      let expQty = it.expnd?.reduce((sum, exp) => sum + exp.qty.value, 0) || 0;
                      const availQty = Number(it.totalQty.value) - Number(expQty);
                      if (availQty < 1) return null;

                      const ind = expndAst.findIndex((e) => e.asgmtId === listModalStt);
                      const exstng = ind > -1 && expndAst[ind].items.find((i) => i.itemId === it._id);

                      return (
                        <div
                          key={it._id}
                          className="col-12 col-sm-6 col-md-4 border rounded-3 p-3 d-flex flex-column gap-2"
                        >
                          <p className="fw-bold mb-1">{it.name}</p>
                          <small className="text-muted">
                            Assigned: {availQty} {it.totalQty.metric}
                          </small>

                          <form onSubmit={(e) => submitExpAst(e, it.totalQty.metric, it._id, it.name, !!exstng)}>
                            <div className="form-floating mb-2">
                              <select className="form-select" name="assetQty" defaultValue={exstng?.qty || ""}>
                                <option value="">Select</option>
                                {Array.from({ length: availQty }, (_, i) => i + 1).map((n) => (
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
                                  onClick={() => dispatch(assignActions.delNewExpnd({ id: it._id }))}
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
            </>
          )}
        </div>
      )}
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default ExpendAssetModal;

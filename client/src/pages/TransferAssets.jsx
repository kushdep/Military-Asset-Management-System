import { useDispatch, useSelector } from "react-redux";
import { transferActions } from "../store/transfer-slice";
import { useEffect, useRef } from "react";
import { baseActions, getBaseData, getBaseIds } from "../store/base-slice";
import { useParams } from "react-router-dom";
import InvntryAssetModal from "../Modals/InvntryAssetModal";
import SeeAllModal from "../Modals/SeeAllModal";
import TransferHistory from "../components/TransferHistory";
import toast from "react-hot-toast";
import axios from "axios";
import React from "react";

function TransferAsset() {
  const { id } = useParams();
  const { baseIds, TINdata, TOUTdata, invtry,baseError } = useSelector((state) => state.baseData);
  const { pageState, selBase, trnsfrAst } = useSelector((state) => state.transferData);
  const { token, role } = useSelector((state) => state.authData);
  const dispatch = useDispatch();
  const tfrAstModalRef = useRef();
  const seeAllModalRef = useRef();

  useEffect(() => {
    if (baseIds.length === 0) dispatch(getBaseIds(token));
    if (TINdata === null || TOUTdata === null || Object.keys(invtry).length === 0)
      dispatch(getBaseData(token, id));

    if (pageState === "" && role !== "COM")
      dispatch(transferActions.setPageState("transfer"));
    else dispatch(transferActions.setPageState("history"));
  }, []);

  function addAsndTfrAst(event, metric, id, name, type, isExstng) {
    event.preventDefault();
    const data = new FormData(event.target);
    const qty = data.get("assetQty");
    if (!qty) return toast.error("Select Qty to Transfer");

    if (isExstng) {
      dispatch(
        transferActions.updAsndAst({
          selBaseId: selBase.id,
          id,
          qty,
          type,
        })
      );
      toast.success("Saved");
    } else {
      dispatch(
        transferActions.setNewAssign({
          selBaseId: selBase.id,
          id,
          name,
          metric,
          qty,
          type,
        })
      );
    }
  }

  async function submitAsgTfrnData(selBaseId) {
    const { Vehicle, Ammunition, Weapons } = trnsfrAst.find(
      (e) => e.baseId === selBaseId
    );
    const body = { toBaseId: selBaseId, trnsfrAst: { Vehicle, Ammunition, Weapons } };

    try {
      const response = await axios.post(
        `https://military-asset-management-system-68gp.onrender.com/dashboard/${id}/transfer-asset`,
        body,
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Asset Transferred Successfully");
        dispatch(transferActions.resetTfrAsgnData({ sel: selBaseId }));
        dispatch(getBaseData(token, id));
        dispatch(transferActions.setSelBase("history"));
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  async function setTFrStts(isRcvd, tfrId) {
    try {
      const response = await axios.post(
        `https://military-asset-management-system-68gp.onrender.com/dashboard/${id}/recieve-asset?status=${isRcvd}`,
        { tfrId },
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Status Updated Successfully");
        dispatch(transferActions.setSelBase("history"));
        dispatch(getBaseData(token, id));
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if(baseError!==''){
    toast.error(baseError)
    dispatch(baseActions.setErrorState({errMsg:''}))
  }

  return (
    <div className="container-fluid py-3">
      <InvntryAssetModal
        reference={tfrAstModalRef}
        submitfun={addAsndTfrAst}
        selField={selBase}
        asgnData={trnsfrAst}
        delAsgnDataFn={transferActions.delNewAssign}
        keyName="baseId"
      />
      <SeeAllModal
        reference={seeAllModalRef}
        dataList={trnsfrAst}
        btnfun={submitAsgTfrnData}
        isBtnSecGrp={true}
        btnTitle="Transfer"
        keyName="baseId"
      />

      <div className="row">
        <div className="col-12 col-md-2 mb-3 d-flex flex-md-column flex-row justify-content-around gap-2">
          <button
            onClick={() => dispatch(transferActions.setPageState("transfer"))}
            className={`btn fw-bold ${pageState === "transfer" ? "btn-dark" : "btn-outline-dark"}`}
          >
            Transfer
          </button>

          {role !== "COM" && (
            <button
              onClick={() => dispatch(transferActions.setPageState("approvals"))}
              className={`btn fw-bold ${pageState === "approvals" ? "btn-dark" : "btn-outline-dark"}`}
            >
              Approvals
            </button>
          )}

          <button
            onClick={() => dispatch(transferActions.setPageState("history"))}
            className={`btn fw-bold ${pageState === "history" ? "btn-dark" : "btn-outline-dark"}`}
          >
            History
          </button>
        </div>

        <div className="col-12 col-md-10">
          <div className="d-flex flex-row-reverse mb-2">
            {trnsfrAst.length > 0 && (
              <button
                className="btn btn-link fw-bold text-success text-decoration-underline"
                onClick={() => seeAllModalRef.current.showModal()}
              >
                See Added Assets
              </button>
            )}
          </div>

          {pageState === "history" ? (
            <TransferHistory TINhis={TINdata} TOUThis={TOUTdata} />
          ) : pageState === "transfer" ? (
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Base ID</th>
                    <th>Base Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {baseIds.length > 0 &&
                    baseIds.map((b) =>
                      b.baseId === id ? null : (
                        <tr key={b._id}>
                          <td>{b.baseId}</td>
                          <td>{b.baseName}</td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                dispatch(
                                  transferActions.setSelBase({
                                    id: b.baseId,
                                    name: b.baseName,
                                  })
                                );
                                tfrAstModalRef.current.showModal();
                              }}
                            >
                              Transfer
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Transfer Date</th>
                    <th>Transfer By</th>
                    <th>Assets</th>
                    <th>Receive Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TINdata?.filter((t) => t.status === "PENDING").map((t) => (
                    <React.Fragment key={t._id}>
                      <tr>
                        <td>{new Date(t.TOUTdate).toLocaleDateString()}</td>
                        <td>{t.by}</td>
                        <td>
                          <button
                            className="btn btn-light fw-semibold"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${t._id}`}
                            aria-expanded="false"
                            aria-controls={`collapse-${t._id}`}
                          >
                            See Assets
                          </button>
                        </td>
                        <td className="d-flex flex-wrap justify-content-center gap-2">
                          <button
                            className="btn btn-success fw-bold"
                            onClick={() => setTFrStts(true, t._id)}
                          >
                            Received
                          </button>
                          <button
                            className="btn btn-danger fw-bold"
                            onClick={() => setTFrStts(false, t._id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                      <tr className="collapse" id={`collapse-${t._id}`}>
                        <td colSpan="4">
                          <div className="card card-body border-0">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
                              {t.astDtl.map((d, i) => (
                                <div
                                  key={i}
                                  className="col border rounded-3 d-flex flex-column align-items-center p-2"
                                >
                                  <span className="fw-bold text-primary">
                                    {d.name}
                                  </span>
                                  <span className="fw-semibold">
                                    Qty - {d.totalQty.value} {d.totalQty.metric}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferAsset;

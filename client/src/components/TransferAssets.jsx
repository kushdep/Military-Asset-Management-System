import { useDispatch, useSelector } from "react-redux";
import { transferActions } from "../store/transfer-slice";
import { useEffect } from "react";
import { getBaseData, getBaseIds } from "../store/base-slice";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import InvntryAssetModal from "../Modals/InvntryAssetModal";
import toast from "react-hot-toast";
import SeeAllModal from "../Modals/SeeAllModal";
import axios from "axios";

function TransferAsset() {
  const { id } = useParams();
  const { baseIds, TINdata, TOUTdata, invtry } = useSelector((state) => state.baseData);
  const { pageState, selBase, trnsfrAst } = useSelector((state) => state.transferData);
  const { token } = useSelector((state) => state.authData);
  const dispatch = useDispatch();
  const tfrAstModalRef = useRef();
  const seeAllModalRef = useRef();

  useEffect(() => {
    if (baseIds.length === 0) {
      dispatch(getBaseIds(token));
    }
    if (
      TINdata === null ||
      TOUTdata === null ||
      Object.keys(invtry).length === 0
    ) {
      dispatch(getBaseData(token, id));
    }
  }, []);

  function addAsndTfrAst(event, metric, id, name, type, isExstng) {
    event.preventDefault();
    console.log(metric);
    console.log(id);
    console.log(name);
    console.log(selBase);
    console.log(isExstng);
    const data = new FormData(event.target);
    const qty = data.get("assetQty");
    if (qty === null || qty === "") {
      toast.error("Select Qty to Assign");
      return;
    }
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
    console.log(selBaseId);
    const { Vehicle, Ammunition, Weapons } = trnsfrAst.find((e) => e.baseId === selBaseId);
    const body = {
      toBaseId: selBaseId,
      trnsfrAst: { Vehicle, Ammunition, Weapons },
    };
    console.log(body);
    try {
      console.log(id);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${id}/transfer-asset`,
        body,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Asset Assigned Successfully");
        dispatch(transferActions.resetTfrAsgnData({ sel:selBaseId  }));
        dispatch(getBaseData(token, id));
      }
      if (response.status === 400) {
        toast.error("Assignment Not possible");
        return;
      }
    } catch (error) {
        console.log(error)
      if (error.response.status === 500) {
        toast.error("Something went wrong");
      }
      return;
    }
    trnsfrAst.length === 0 && seeAllModalRef.current.close();
  }

  return (
    <div className="container-fluid">
      <InvntryAssetModal
        reference={tfrAstModalRef}
        submitfun={addAsndTfrAst}
        selField={selBase}
        asgnData={trnsfrAst}
        delAsgnDataFn={transferActions.delNewAssign}
        keyName={"baseId"}
      />
      <SeeAllModal
        reference={seeAllModalRef}
        dataList={trnsfrAst}
        btnfun={submitAsgTfrnData}
        isBtnSecGrp={true}
        btnTitle="Transfer"
        keyName={"baseId"}
      />
      <div className="row mt-2">
        <div className="col-1 p-2 d-flex flex-column gap-2">
          <button
            onClick={() => dispatch(transferActions.setPageState("transfer"))}
            className={`btn fw-bold p-2 ${
              pageState === "transfer"
                ? "active btn-success"
                : "btn-outline-success"
            }`}
          >
            Transfer
          </button>
          <button
            onClick={() => dispatch(transferActions.setPageState("approvals"))}
            className={`btn fw-bold p-2 ${
              pageState === "approvals"
                ? "active btn-success"
                : "btn-outline-success"
            }`}
          >
            Approvals
          </button>
          <button
            onClick={() => dispatch(transferActions.setPageState("history"))}
            className={`btn fw-bold p-2 ${
              pageState === "history"
                ? "active btn-success"
                : "btn-outline-success"
            }`}
          >
            History
          </button>
        </div>
        <div className="col">
          <div className="d-flex flex-row-reverse">
            {trnsfrAst.length > 0 && (
              <button
                className="btn fw-bold text-success text-decoration-underline"
                onClick={() => {
                  seeAllModalRef.current.showModal();
                }}
              >
                See Added Assets
              </button>
            )}
          </div>
          {pageState === "history" ? (
            <Transferhistory />
          ) : pageState === "transfer" ? (
            <table className="table border border-black mt-3">
              <thead>
                <tr>
                  <th scope="col">BaseId</th>
                  <th scope="col">BaseName</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className="table-group-divider border">
                {baseIds.length > 0 &&
                  baseIds.map((b, i) => {
                    if (b.baseId === id) {
                      return;
                    }
                    return (
                      <tr key={b._id}>
                        <th scope="row">{b.baseId}</th>
                        <td>{b.baseName}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              console.log(b);
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
                    );
                  })}
              </tbody>{" "}
            </table>
          ) : (
            <table className="table border border-black mt-3 text-center">
              <thead>
                <tr>
                  <th scope="col">SId</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className="table-group-divider border">
                {assignSldr.length > 0 &&
                  assignSldr.map((s, i) => {
                    return (
                      <tr key={s}>
                        <th className={"col"} scope="row">
                          {s}
                        </th>
                        <td>
                          <button
                            className="btn btn-outline-success fw-bold"
                            onClick={() => {
                              dispatch(
                                assignActions.setSelSldr({
                                  id: s,
                                  name: "",
                                })
                              );
                              expendModalRef.current.showModal();
                            }}
                          >
                            See Assigned Assets
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferAsset;

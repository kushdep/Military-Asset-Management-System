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
import React from "react";
import TransferHistory from "../components/TransferHistory";

function TransferAsset() {
  const { id } = useParams();
  const { baseIds, TINdata, TOUTdata, invtry,baseError } = useSelector(
    (state) => state.baseData
  );
  const { pageState, selBase, trnsfrAst } = useSelector(
    (state) => state.transferData
  );
  const { token,role } = useSelector((state) => state.authData);
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
     if(pageState==='' && role!=='COM'){
    dispatch(transferActions.setPageState('transfer'))
  }else{
    dispatch(transferActions.setPageState('history'))
  }
  }, []);

  function addAsndTfrAst(event, metric, id, name, type, isExstng) {
    event.preventDefault();
    const data = new FormData(event.target);
    const qty = data.get("assetQty");
    if (qty === null || qty === "") {
      toast.error("Select Qty to Transfer");
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
    const { Vehicle, Ammunition, Weapons } = trnsfrAst.find(
      (e) => e.baseId === selBaseId
    );
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
        toast.success("Asset Transferred Successfully");
        dispatch(transferActions.resetTfrAsgnData({ sel: selBaseId }));
        dispatch(getBaseData(token, id));
        dispatch(transferActions.setSelBase('history'));
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error("Transfer Not possible");
        return;
      }
      if (error.response.status === 500) {
        toast.error("Something went wrong");
      }
      return;
    }
    trnsfrAst.length === 0 && seeAllModalRef.current.close();
  }

  async function setTFrStts(isRcvd,tfrId) {
    try {
     const body = {
        tfrId
     }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${id}/recieve-asset?status=${isRcvd}`,
        body
        ,{
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Status Updated Successfully");
        dispatch(transferActions.setSelBase('history'));
        dispatch(getBaseData(token, id));
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error("Something went wrong");
        return;
      }
      if (error.response.status === 500) {
        toast.error("Something went wrong");
      }
      return;
    }
  }

   if(baseError!==null){
    toast.error(baseError)
    return 
  }

 


  console.log(TINdata);
  console.log(TOUTdata);
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
                ? "active btn-dark"
                : "btn-outline-dark"
            }`}
          >
            Transfer
          </button>
          {
            role!=='COM' && 
          <button
            onClick={() => dispatch(transferActions.setPageState("approvals"))}
            className={`btn fw-bold p-2 ${
              pageState === "approvals"
                ? "active btn-dark"
                : "btn-outline-dark"
            }`}
          >
            Approvals
          </button>
}
          <button
            onClick={() => dispatch(transferActions.setPageState("history"))}
            className={`btn fw-bold p-2 ${
              pageState === "history"
                ? "active btn-dark"
                : "btn-outline-dark"
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
            <TransferHistory TINhis={TINdata} TOUThis={TOUTdata}/>
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
                            className="btn btn-success"
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
                  <th scope="col">Transfer Date</th>
                  <th scope="col">Transfer By</th>
                  <th scope="col">Assets</th>
                  <th scope="col">Recieve Status</th>
                </tr>
              </thead>
              <tbody className="table-group-divider border">
                {TINdata.length > 0 &&
                  TINdata.map((t, i) => {
                    if (t.status !== "PENDING") return null;
                    console.log(t)
                    return (
                      <React.Fragment key={t._id}>
                        <tr>
                          <th scope="row">
                            {new Date(t.TOUTdate).toLocaleDateString()}
                          </th>
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
                              See Transferred Assets
                            </button>
                          </td>
                          <td className="p-3 d-flex justify-content-center gap-3">
                            <button className="btn btn-success fw-bold"
                            onClick={()=>setTFrStts(true,t._id)}
                            >
                              Recieved
                            </button>
                            <button className="btn btn-danger fw-bold"
                            onClick={()=>setTFrStts(false,t._id)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>

                        <tr className="collapse" id={`collapse-${t._id}`}>
                          <td colSpan="4">
                            <div className="card card-body border-0 container p-2">
                                <div className="row row-cols-3">
                              {t.astDtl.map((d) => {
                                
                                return <div className="col border d-flex rounded-3 justify-content-around">
                                    
                                    <span className="fw-bold text-primary">{d.name}</span>{" "}
                                    <span className="fw-semibold">Qty - {d.totalQty.value}
                                    {d.totalQty.metric}</span>
                                    
                                </div>
                                })}
                            </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
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

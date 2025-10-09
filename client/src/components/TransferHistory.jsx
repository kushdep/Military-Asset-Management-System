import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function TransferHistory({ TINhis, TOUThis }) {
  const [hisState, selHisState] = useState("IN");
  let hisData = [];

    hisData = hisState === "IN" ? TINhis : TOUThis;

  console.log(hisData)

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col text-center">
          <div
            className="btn-group w-50"
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              className={`fw-bold btn ${
                hisState === "IN" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => selHisState("IN")}
            >
              Transfer IN
            </button>
            <button
              type="button"
              className={`fw-bold btn ${
                hisState === "OUT" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => selHisState("OUT")}
            >
              Transfer OUT
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <table className="table border border-black mt-3 text-center">
          <thead>
            <tr>
              <th scope="col">Transfer Date</th>
              <th scope="col">Transfer To</th>
              <th scope="col">Assets</th>
              <th scope="col">Recieve Status</th>
              <th scope="col">Recieved Date</th>
            </tr>
          </thead>
          <tbody className="table-group-divider border">
            {hisData.length > 0 ?
              hisData.map((t, i) => {
                return (
                  <React.Fragment key={t._id}>
                    <tr>
                      <th scope="row">
                        {new Date(t.TOUTdate).toLocaleDateString()}
                      </th>
                      <td>{t.to}</td>
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
                      <td className="p-3 d-flex justify-content-around">
                        <span class={`badge p-2 text-light ${t.status==='PENDING'?'text-bg-info':(t.status==='RECIEVED'?'text-bg-success':'text-bg-danger')}`}>{t.status}</span>
                      </td>
                      <td>{t.status!=='PENDING'?`${new Date(t.TINdate).toLocaleDateString()}`:"-"}</td>
                    </tr>

                    <tr className="collapse" id={`collapse-${t._id}`}>
                      <td colSpan="4">
                        <div className="card card-body border-0 container p-2">
                          <div className="row row-cols-3">
                            {t.astDtl.map((d) => {
                              return (
                                <div className="col border d-flex rounded-3 justify-content-around">
                                  <span className="fw-bold text-primary">
                                    {d.name}
                                  </span>{" "}
                                  <span className="fw-semibold">
                                    Qty - {d.totalQty.value}
                                    {d.totalQty.metric}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              }):<h3 className="text-center text-muted">No data</h3>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransferHistory;

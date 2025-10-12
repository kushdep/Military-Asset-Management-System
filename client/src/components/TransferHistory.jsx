import React, { useState } from "react";

function TransferHistory({ TINhis, TOUThis }) {
  const [hisState, selHisState] = useState("IN");
  const hisData = hisState === "IN" ? TINhis : TOUThis;

  return (
    <div className="container-fluid py-3">
      <div className="row mb-3">
        <div className="col text-center">
          <div
            className="btn-group w-75 gap-1"
            role="group"
            aria-label="Transfer Type Switch"
          >
            <button
              type="button"
              className={`fw-bold btn ${
                hisState === "IN" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => selHisState("IN")}
            >
              Transfer IN
            </button>
            <button
              type="button"
              className={`fw-bold btn ${
                hisState === "OUT" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => selHisState("OUT")}
            >
              Transfer OUT
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="table-responsive shadow-sm rounded-3">
            <table className="table table-striped table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Transfer Date</th>
                  <th scope="col">Transfer {hisState === "IN" ? "By" : "To"}</th>
                  <th scope="col">Assets</th>
                  <th scope="col">Receive Status</th>
                  <th scope="col">Received Date</th>
                </tr>
              </thead>
              <tbody>
                {hisData.length > 0 ? (
                  hisData.map((t) => (
                    <React.Fragment key={t._id}>
                      <tr>
                        <td>{new Date(t.TOUTdate).toLocaleDateString()}</td>
                        <td>{hisState === "IN" ? t.by : t.to}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary fw-semibold"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${t._id}`}
                            aria-expanded="false"
                            aria-controls={`collapse-${t._id}`}
                          >
                            See Assets
                          </button>
                        </td>
                        <td>
                          <span
                            className={`badge p-2 ${
                              t.status === "PENDING"
                                ? "bg-info"
                                : t.status === "RECEIVED"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          {t.status !== "PENDING"
                            ? t.status !== "CANCELLED"
                              ? `${new Date(t.TINdate).toLocaleDateString()} (${new Date(
                                  t.TINdate
                                ).toLocaleTimeString()})`
                              : "-"
                            : "-"}
                        </td>
                      </tr>

                      <tr className="collapse" id={`collapse-${t._id}`}>
                        <td colSpan="5" className="p-0">
                          <div className="card card-body border-0">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
                              {t.astDtl.map((d, index) => (
                                <div
                                  key={index}
                                  className="col border rounded-3 d-flex flex-column align-items-center justify-content-center p-2 bg-light"
                                >
                                  <span className="fw-bold text-primary">{d.name}</span>
                                  <span className="fw-semibold">
                                    Qty: {d.totalQty.value} {d.totalQty.metric}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferHistory;

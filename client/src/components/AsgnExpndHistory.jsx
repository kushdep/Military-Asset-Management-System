import { useSelector } from "react-redux";

function AsgnExpndhistory() {
  const { assignData } = useSelector((state) => state.baseData);
  const asgnExpndHistory = [];

  if (assignData && assignData.length > 0) {
    assignData.forEach((asgn) => {
      let ind = asgnExpndHistory.findIndex((a) => a.sId === asgn.sId);

      if (ind === -1) {
        const data = { sId: asgn.sId, asgnExpndList: [asgn.items] };
        asgnExpndHistory.push(data);
      } else {
        asgnExpndHistory[ind].asgnExpndList.push(asgn.items);
      }
    });
  }

  return (
    <div className="container mt-3">
      {asgnExpndHistory.length > 0 ? (
        asgnExpndHistory.map((asgnHis) => (
          <div className="row mt-3" key={asgnHis.sId}>
            <div className="col">
              <button
                className="btn btn-light fw-semibold w-75"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${asgnHis.sId}`}
                aria-expanded="false"
              >
                <div className="d-flex align-items-center justify-content-center border rounded-3 p-2 bg-light">
                  Soldier ID: <span className="fw-bold">{asgnHis.sId}</span>
                </div>
              </button>

              <div className="collapse mt-2" id={`collapse-${asgnHis.sId}`}>
                <div className="card card-body shadow-sm border-0">
                  {asgnHis.asgnExpndList.map((agnEpnd, i) => (
                    <div
                      className="d-flex flex-wrap gap-3 border-bottom pb-3 mb-3"
                      key={i}
                    >
                      {agnEpnd.map((a, j) => {
                        const asgnQty =
                          a.totalQty.value +
                          (a.expnd?.reduce((sum, e) => sum + e.qty.value, 0) ||
                            0);

                        return (
                          <div
                            className="border rounded-3 p-3 flex-fill"
                            key={j}
                            style={{ minWidth: "280px" }}
                          >
                            <div className="mb-2">
                              <p className="fw-semibold mb-1">
                                Total Assigned Qty of{" "}
                                <span className="text-primary">
                                  {a.name || a.category}
                                </span>{" "}
                                – {asgnQty} {a.totalQty.metric}
                              </p>

                              {a.createdAt && (
                                <small className="text-muted">
                                  {new Date(a.createdAt)
                                    .toISOString()
                                    .slice(0, 10)}{" "}
                                  (
                                  {new Date(a.createdAt)
                                    .toISOString()
                                    .slice(11, 19)}
                                  )
                                </small>
                              )}
                            </div>

                            <p className="fw-semibold mb-1">Expended Assets</p>
                            {a.expnd.length > 0 ? (
                              <ul className="mb-0 ps-3">
                                {a.expnd.map((x, k) => (
                                  <li key={k} className="small">
                                    Qty –{" "}
                                    <span className="fw-semibold">
                                      {x.qty.value} {x.qty.metric}
                                    </span>
                                    , Expend Date –{" "}
                                    <span className="text-muted">
                                      {new Date(x.expndDate)
                                        .toISOString()
                                        .slice(0, 10)}{" "}
                                      (
                                      {new Date(x.expndDate)
                                        .toISOString()
                                        .slice(11, 19)}
                                      )
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted small mb-0">
                                No Data of Expend
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted py-5">
          No Assigned and Expended Asset History
        </div>
      )}
    </div>
  );
}

export default AsgnExpndhistory;

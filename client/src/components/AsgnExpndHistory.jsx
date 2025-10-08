import { useDispatch, useSelector } from "react-redux";
import useFilter from "../hooks/useFilter";
import { useRef } from "react";
import toast from "react-hot-toast";

function AsgnExpndhistory() {
  const { assignData } = useSelector((state) => state.baseData);
  const { dateRange, handleDateRange, assetType, handleAssetType } = useFilter({
    code: "NF",
    name: "",
  });
  let sno = 1;
  const dispatch = useDispatch();
  const fromInp = useRef();
  const toInp = useRef();

  let asgnExpndHistory = [];
  if (assignData !== null && assignData.length > 0) {
    assignData.forEach((asgn) => {
      let ind = asgnExpndHistory.findIndex((a) => a.sId === asgn.sId);
      if (ind === -1) {
        ind = asgnExpndHistory.length;
        let data = { sId: asgn.sId, asgnExpndList: [] };
        data.asgnExpndList.push(asgn.items);
        asgnExpndHistory[ind] = data;
      } else {
        asgnExpndHistory[ind].asgnExpndList.push(asgn.items);
      }
    });
  }
  console.log(asgnExpndHistory);

  return (
    <div className="container">
      {asgnExpndHistory.length > 0 ? (
        asgnExpndHistory.map((asgnHis) => {
          return (
            <div className="row mt-2">
              <div className="col ">
                <div className="d-inline-flex gap-1 border rounded-3">
                  <button
                    className="btn btn-light border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${asgnHis.sId}`}
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    Soldier Id - <span className="fw-bold">{asgnHis.sId}</span>
                  </button>
                </div>
                <div className="collapse" id={`${asgnHis.sId}`}>
                  <div className="card card-body">
                    {asgnHis.asgnExpndList.map((a) => {
                      let asgnQty = a.totalQty.value;
                      if (a.expnd.length > 0) {
                        asgnQty += a.expnd.reduce(
                          (sum, e) => sum + e.qty.value,
                          0
                        );
                      }
                      return (
                        <div>
                          <div>
                            <p className="fw-semibold fs-4">
                              Total Assigned Qty 0f {a.name} -{" "}
                              {a.totalQty.value} {a.totalQty.metric}
                            </p>
                            <p className="text-muted">
                              {
                                <p className="text-muted">
                                  {new Date(a.createdAt)
                                    .toISOString()
                                    .slice(0, 10)}{" "}
                                  (
                                  {new Date(a.createdAt)
                                    .toISOString()
                                    .slice(11, 19)}
                                  )
                                </p>
                              }
                            </p>
                          </div>
                          <p className="fw-semibold fs-4">Expended Assets</p>
                          {e.expnd.length > 0 ? (
                            <ul>
                              {e.expnd.map((x) => {
                                return (
                                  <li>
                                    Qty -{" "}
                                    <span>
                                      {x.qty.value} {x.qty.metric}
                                    </span>{" "}
                                    Expend Date -{" "}
                                    <span className="text-muted">
                                      {new Date(a.createdAt)
                                        .toISOString()
                                        .slice(0, 10)}{" "}
                                      (
                                      {new Date(a.createdAt)
                                        .toISOString()
                                        .slice(11, 19)}
                                      )
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p>No Data of Expend</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>No Assigned And Expend of Assets History</div>
      )}
    </div>
  );
}

export default AsgnExpndhistory;

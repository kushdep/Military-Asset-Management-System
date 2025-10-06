import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import useFilter from "../hooks/useFilter";
import { useEffect, useRef } from "react";
import { getBaseData } from "../store/base-slice";
import toast from "react-hot-toast";

function PurchaseHistoryTable() {
  const { purchaseHistory } = useSelector((state) => state.baseData);
  const {
    dateRange,
    handleDateRange,
    assetType,
    handleAssetType,
    fltrErr,
  } = useFilter({
    code: "NF",
    name: "",
  });
  let sno = 1;
  const dispatch = useDispatch();
  const fromInp = useRef();
  const toInp = useRef();

  useEffect(() => {
    if (purchaseHistory === null) {
      dispatch(getBaseData());
    }
  }, [purchaseHistory]);
  console.log(purchaseHistory);
  console.log(dateRange)
  console.log(assetType)

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-2">
          <div className="form-floating">
            <select
              className="form-select"
              id="floatingSelectGrid"
              onChange={(e) => handleAssetType(e.target.value)}
            >
              <option value="NF" selected>
                No Type Filter
              </option>
              {itemType.map((i) => {
                return (
                  <option value={i.code} className="dropdown-item">
                    {i.name}
                  </option>
                );
              })}
            </select>
            <label for="floatingSelectGrid">Works with selects</label>
          </div>
        </div>
        <div className="col d-flex p-2">
          <div className="col-md-3">
            <label className="form-label fw-bold">From:</label>
            <input type="date" ref={fromInp} className="form-control" />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">To:</label>
            <input ref={toInp} type="date" className="form-control" />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-success w-100"
              onClick={() =>{
                if(new Date(fromInp.current?.value)>new Date(toInp.current?.value)){
                  toast.error('Wrong Dates')
                  return 
                }
                handleDateRange(fromInp.current?.value, toInp.current?.value)
              }
              }
              disabled={
                fromInp.current?.value === "" && toInp.current?.value === ""
              }
            >
              Filter
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col">
          <table className="table border border-black">
            <thead>
              <tr>
                <th scope="col">Sno</th>
                <th scope="col">Item</th>
                <th scope="col">Type</th>
                <th scope="col">Qty</th>
                <th scope="col">Added By</th>
                <th scope="col">Purchase Date</th>
                <th scope="col">Purchase Time</th>
              </tr>
            </thead>
            <tbody className="table-group-divider border">
              {purchaseHistory?.length ? (
                purchaseHistory.map((purchs) =>
                  purchs.items.map((i) => {
                    if (assetType.code !== "NF") {
                      if (assetType !== i.asset.type) {
                        return;
                      }
                    }
                    if (
                      dateRange.from !== "" &&
                      dateRange.to !== ""
                    ) {
                      const purDate = new Date(purchs.createdAt).getTime();
                      const fromFilDate = new Date(dateRange.from).getTime();
                      const toFilDate = new Date(dateRange.to).getTime();
                      if (!(purDate >= fromFilDate && purDate <= toFilDate)) {
                        return;
                      }
                    }
                    const createdTime = new Date(
                      purchs.createdAt
                    ).toISOString();
                    const purDate = createdTime.slice(0, 10);
                    const timeStamp = createdTime.slice(11);
                    return (
                      <tr key={i.asset._id}>
                        <th scope="row">{sno++}</th>
                        <td>{i.asset.name}</td>
                        <td>{i.asset.type}</td>
                        <td>{i.qty}</td>
                        <td>{purchs.addedBy}</td>
                        <td>{purDate}</td>
                        <td>{timeStamp}</td>
                      </tr>
                    );
                  })
                )
              ) : (
                <tr>
                  <td colSpan={8}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PurchaseHistoryTable;

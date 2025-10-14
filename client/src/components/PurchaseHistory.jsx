import { useDispatch, useSelector } from "react-redux";
import { itemType } from "../../config";
import useFilter from "../hooks/useFilter";
import { useEffect, useRef } from "react";
import { getBaseData } from "../store/base-slice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function PurchaseHistoryTable() {
  const { purchaseHistory, actvId } = useSelector((state) => state.baseData);
  const { token } = useSelector((state) => state.authData);
  const { dateRange, handleDateRange, assetType, handleAssetType } = useFilter({
    code: "NF",
    name: "",
  });
  let sno = 1;
  const dispatch = useDispatch();
  const fromInp = useRef();
  const toInp = useRef();
  const { id } = useParams();

  useEffect(() => {
    if (purchaseHistory === null) {
      const baseIdToUse = id ?? actvId?.id;
      dispatch(getBaseData(token, baseIdToUse));
    }
  }, [purchaseHistory]);

  return (
    <div className="container-fluid p-3">
      <div className="row gy-3 align-items-end">
        <div className="col-12 col-md-3">
          <div className="form-floating">
            <select
              className="form-select"
              id="floatingSelectGrid"
              onChange={(e) =>
                handleAssetType({ code: e.target.value, name: e.target.value })
              }
              value={assetType?.code}
            >
              <option value="NF" selected>
                No Type Filter
              </option>
              {itemType.map((i) => (
                <option value={i.code} key={i.code}>
                  {i.name}
                </option>
              ))}
            </select>
            <label htmlFor="floatingSelectGrid">Asset Type</label>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label fw-bold">From:</label>
          <input
            type="date"
            ref={fromInp}
            className="form-control"
            defaultValue={dateRange.from}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label fw-bold">To:</label>
          <input
            ref={toInp}
            type="date"
            className="form-control"
            defaultValue={dateRange.to}
          />
        </div>

        <div className="col-12 col-md-2 d-flex">
          <button
            className="btn btn-success fw-semibold w-100"
            onClick={() => {
              const from = new Date(fromInp.current?.value)
              const to = new Date(toInp.current?.value)
              if ( from>to) {
                toast.error("Wrong Dates");
                return;
              }
              if ( from===to) {
                toast.error("Same day not allowed");
                return;
              }
              handleDateRange(fromInp.current?.value, toInp.current?.value);
            }}
          >
            Filter
          </button>
          <button
            className="btn btn-outline-dark fw-semibold w-100 ms-2"
            onClick={() => {
              handleDateRange("", "");
              handleAssetType({ code: "NF", name: "" });
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="table-responsive shadow-sm rounded-3 border border-light">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark text-center">
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Item</th>
                  <th scope="col">Type</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Added By</th>
                  <th scope="col">Purchase Date</th>
                  <th scope="col">Purchase Time</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory?.length ? (
                  purchaseHistory.map((purchs) =>
                    purchs.items.map((i) => {
                      if (
                        assetType.code !== "NF" &&
                        assetType.code !== i.asset.type
                      )
                        return;

                      const createdAt = new Date(purchs.purchaseDate);
                      const timeStamp = createdAt.toLocaleTimeString();
                      const createdTime = createdAt.toISOString();
                      const purDate = createdTime.slice(0, 10);

                      if (dateRange.from !== "" && dateRange.to !== "") {
                        const purchaseDate = new Date(purDate).getTime();
                        const fromFilDate = new Date(dateRange.from).getTime();
                        const toFilDate = new Date(dateRange.to).getTime();
                        if (
                          !(
                            purchaseDate >= fromFilDate &&
                            purchaseDate <= toFilDate
                          )
                        ) {
                          return;
                        }
                      }

                      return (
                        <tr key={i.asset._id} className="text-center">
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
                  <tr className="text-center">
                    <td colSpan={7}>No data available</td>
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

export default PurchaseHistoryTable;

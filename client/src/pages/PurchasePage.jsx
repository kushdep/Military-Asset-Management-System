import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { itemType } from "../../config";
import toast from "react-hot-toast";

function PurchasePage() {
  let sno = 1;
  const { purchsData } = useSelector((state) => state.baseData);
  const [filter, setFilter] = useState({
    type: "",
    date: { fromDate: "", toDate: "" },
  });
  const fromInp = useRef();
  const toInp = useRef();

  function setTypeFilter(typeVal) {
    setFilter((prev) => {
      if (typeVal === "NF") {
        return { ...prev, type: "" };
      }
      return { ...prev, type: typeVal };
    });
  }

  function setDateFilter() {
    const to = new Date(toInp.current.value).getTime();
    const from = new Date(fromInp.current.value).getTime();
    if (from > to) {
      toast.error("Choose valid dates");
      toInp.current.value = "";
      fromInp.current.value = "";
      return;
    }

    setFilter((prev) => {
        return {
          ...prev,
          date: {
            fromDate: fromInp.current.value,
            toDate: toInp.current.value,
          },
        };
    });
  }
  console.log(filter);
  return (
    <>
      <div className="container">
        <div className="row mt-2">
          <div className="col-2">
            <div className="form-floating">
              <select
                className="form-select"
                id="floatingSelectGrid"
                onChange={(e) => setTypeFilter(e.target.value)}
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
              <input
                type="date"
                ref={fromInp}
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">To:</label>
              <input
                ref={toInp}
                type="date"
                className="form-control"

              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-success w-100"
                onClick={setDateFilter}
                // disabled={
                //   filter.date.toDate === "" && filter.date.fromDate === ""
                // }
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
                  <th scope="col">Price</th>
                  <th scope="col">Total</th>
                  <th scope="col">Purchase Date</th>
                </tr>
              </thead>
              <tbody className="table-group-divider border">
                {purchsData.map((purchs, ind) =>
                  purchs.items.map((p, i) => {
                    if (
                      filter.type !== "" ||
                      (filter.date.fromDate !== "" && filter.date.toDate !== "")
                    ) {
                      if (filter.type !== "" && p.asset.type !== filter.type) {
                        return;
                      }
                      if (
                        filter.date.fromDate !== "" &&
                        filter.date.toDate !== ""
                      ) {
                        const purDate = new Date(purchs.createdAt).getTime();
                        const fromFilDate = new Date(
                          filter.date.fromDate
                        ).getTime();
                        const toFilDate = new Date(
                          filter.date.toDate
                        ).getTime();
                        if (!(purDate >= fromFilDate && purDate <= toFilDate)) {
                          return;
                        }
                      }
                    }
                    return (
                      <tr key={p._id}>
                        <th scope="row">{sno++}</th>
                        <td>{p.asset.name}</td>
                        <td>{p.asset.type}</td>
                        <td>{p.pcngDtls.qty}</td>
                        <td>{p.asset.price}</td>
                        <td>{p.pcngDtls.ttlAmt}</td>
                        <td>
                          {new Date(purchs.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchasePage;

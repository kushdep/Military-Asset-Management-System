import { itemType } from "../../config";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { baseActions } from "../store/base-slice";

function DashboardStats() {
  const { openingBal, closingBal, NetMvmnt, assignData } = useSelector(
    (state) => state.baseData
  );
  const [formStt, formAcn,isPending] = useActionState(action, {
    from: null,
    to: null,
    category: "",
  });

  const dispatch = useDispatch()

  function action(prevStt, formData) {
    const category = formData.get("category");
    const fromDate = formData.get("fromDate");
    const toDate = formData.get("toDate");

    if (category === null || fromDate === null || toDate === null) {
      toast.error("Please fill all fields");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (from > to) {
      toast.error("Please Select valid Dates");
      return;
    }

    if (to - from < 7 * 24 * 60 * 60) {
      toast.error("Please Select atleast a week ");
      return;
    }

    if (
      from > new Date(new Date().toLocaleDateString()) ||
      to > new Date(new Date().toLocaleDateString())
    ) {
      toast.error("Stats can be answered only by yesterday");
      return;
    }

    dispatch(baseActions.setDashboardMetrics({category,fromDate,toDate}))
  }

  return (
    <div className="container-fluid">
      <form className="row mt-2" action={formAcn}>
        <div className="col-2">
          <div className="form-floating">
            <select
              className="form-select"
              id="floatingSelectGrid"
              name="category"
            >
              <option value="ALL" selected>
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
            <input type="date" name="toDate" className="form-control" />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">To:</label>
            <input type="date" name="fromDate" className="form-control" />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-success w-100">
              Filter
            </button>
          </div>
        </div>
      </form>
      <div class="row mt-2">
        <div class="col-sm-6 mb-3 mb-sm-0 p-2">
          <div class="card border-3 shadow rounded-4 p-2">
            <div class="card-body">
              <h1 class="card-title fw-bold">
                Opening Balance : -{" "}
                <span className="fw-semibold text-success">{openingBal}</span>
              </h1>
            </div>
          </div>
        </div>
        <div class="col-sm-6 mb-3 mb-sm-0 p-2">
          <div class="card border-3 shadow rounded-4 p-2">
            <div class="card-body">
              <h1 class="card-title fw-bold">
                Closing Balance : -{" "}
                <span className="fw-semibold text-primary">{closingBal}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-sm-6 mb-3 mb-sm-0 w-100">
          <div class="card border-3 shadow rounded-4 p-2">
            <h3 className="fw-bold p-2">Net Movement</h3>
            <div class="card-body d-flex flex-row">
              <button className="btn btn-outline-success border-3 fw-bold">
                Purchase
              </button>
              +
              <button className="btn btn-outline-primary border-3 fw-bold">
                Transfer-IN
              </button>
              -
              <button className="btn btn-outline-danger border-3 fw-bold">
                Transfer-OUT
              </button>
              =
              <div>
                <h3 className="fw-bold text-warning">{NetMvmnt}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-sm-6 mb-3 mb-sm-0">
          <div class="card border-3 shadow rounded-4">
            <h3 class="card-title fw-bold p-3">Assigned Assets </h3>
            <div class="card-body"></div>
          </div>
        </div>
        <div class="col-sm-6 mb-3 mb-sm-0">
          <div class="card border-3 shadow rounded-4">
            <h3 class="card-title fw-bold p-3">Expended Assets </h3>
            <div class="card-body"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;

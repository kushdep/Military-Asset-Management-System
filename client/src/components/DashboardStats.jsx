import { itemType, months } from "../../config";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { baseActions } from "../store/base-slice";
import SeeAllModal from "../Modals/SeeAllModal";
import { useState } from "react";
import { useRef } from "react";

function DashboardStats() {
  const {
    dashMetric,
    invtry,
    TOUTdata,
    TINdata,
    purchaseHistory,
    actvId,
    assignData,
  } = useSelector((state) => state.baseData);
  const [btnHisState, setBtnHisState] = useState([]);
  const [formStt, formAcn, isPending] = useActionState(action, {
    from: "",
    to: "",
    category: "",
    err: "",
  });

  const dispatch = useDispatch();
  const hisModalRef = useRef();

  function action(prevStt, formData) {
    let category = formData.get("category");
    const fromDate = formData.get("fromDate");
    const toDate = formData.get("toDate");

    if (category === "") {
      category = "all";
    }

    if (fromDate === "" || toDate === "") {
      toast.error("Please fill all fields");
      return {
        from: fromDate,
        to: toDate,
        category: category,
        err: "Invalid Dates",
      };
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      toast.error("Please select valid dates");
      return {
        from: fromDate ?? null,
        to: toDate ?? null,
        category: category ?? "",
        err: "Invalid Dates",
      };
    }

    if (to - from < 7 * 24 * 60 * 60 * 1000) {
      toast.error("Please select at least a week");
      return {
        from: fromDate ?? null,
        to: toDate ?? null,
        category: category ?? "",
        err: "Invalid Dates",
      };
    }

    if (
      from > new Date(new Date().toLocaleDateString()) ||
      to > new Date(new Date().toLocaleDateString())
    ) {
      toast.error("Stats can be analyzed only till yesterday");
      return {
        from: fromDate,
        to: toDate,
        category: category,
        err: "Invalid Dates",
      };
    }

    const openingBal = calcOpeningBal(
      category,
      fromDate,
      invtry,
      TINdata,
      TOUTdata,
      assignData,
      purchaseHistory,
      actvId
    );
    const closingBal = calcClosingBal(
      category,
      fromDate,
      toDate,
      openingBal,
      TINdata,
      TOUTdata,
      assignData,
      purchaseHistory,
      actvId
    );
    const netMovement = calcNetMvmntBal(
      category,
      fromDate,
      toDate,
      purchaseHistory,
      TINdata,
      TOUTdata,
      actvId
    );

    dispatch(
      baseActions.setDashboardMetrics({
        opening: openingBal,
        closing: closingBal,
        netMovement,
      })
    );
    return {
      from: fromDate,
      to: toDate,
      category: category,
      err: "",
    };
  }

  const calcOpeningBal = (
    fltrType,
    from,
    inventory,
    inAst,
    outAst,
    asgnAst,
    purchase,
    baseId
  ) => {
    try {
      let openingBal = 0;
      const dateObj = new Date(from);
      const month = months[dateObj.getMonth()];
      const isFirstDay = dateObj.getDate() === 1;

      itemType.forEach((t) => {
        if (fltrType !== "all" && t.name !== fltrType) return;
        if (!inventory[t.name]) return;

        const sum = inventory[t.name].reduce(
          (total, inv) => total + (inv.OpeningBalQty?.[month] || 0),
          0
        );
        openingBal += sum;
      });
      if (isFirstDay) return openingBal;

      const m = dateObj.getMonth() + 1;
      const y = dateObj.getFullYear();
      const firstDate = `01-${m}-${y}`;

      const midOpnngBal = calcClosingBal(
        fltrType,
        firstDate,
        from,
        openingBal,
        inAst,
        outAst,
        asgnAst,
        purchase,
        baseId
      );

      return midOpnngBal ?? null;
    } catch (error) {
      console.error("calcOpeningBal error:", error);
      return null;
    }
  };

  const calcClosingBal = (
    fltrType,
    from,
    closingDate,
    opnngBal,
    inAst,
    outAst,
    asgnAst,
    purchase,
    baseId
  ) => {
    try {
      let totalTout = 0;
      let totalPur = 0;
      let totalExpnd = 0;
      let totalTin = 0;
      const fromEpch = new Date(from);
      const clsngEpch = new Date(closingDate);

      itemType.forEach((t) => {
        if (fltrType !== "all" && t.name !== fltrType) return;

        outAst.forEach((o) => {
          if (
            o.by === baseId._id &&
            o.status === "RECEIVED" &&
            new Date(o.TOUTdate) >= fromEpch &&
            new Date(o.TOUTdate) <= clsngEpch
          ) {
            totalTout += o.astDtl.reduce((sum, ast) => {
              if (fltrType !== "all" && ast.category !== fltrType) return sum;
              return sum + (ast.totalQty?.value || 0);
            }, 0);
          }
        });

        asgnAst.forEach((a) => {
          if (a.baseId !== baseId._id) return;

          totalExpnd += a.items.reduce((sum, item) => {
            if (fltrType !== "all" && item.category !== fltrType) return sum;

            const expSum = item.expnd.reduce((expTotal, exp) => {
              const expDate = new Date(exp.expndDate);
              if (expDate >= fromEpch && expDate <= clsngEpch) {
                return expTotal + (exp.qty?.value || 0);
              }
              return expTotal;
            }, 0);

            return sum + expSum;
          }, 0);
        });

        inAst.forEach((i) => {
          if (
            i.to === baseId.id &&
            i.status === "RECEIVED" &&
            new Date(i.TINdate) >= fromEpch &&
            new Date(i.TINdate) <= clsngEpch
          ) {
            totalTin += i.astDtl.reduce((sum, ast) => {
              if (fltrType !== "all" && ast.category !== fltrType) return sum;
              return sum + (ast.totalQty?.value || 0);
            }, 0);
          }
        });

        purchase.forEach((p) => {
          if (p.base !== baseId.base_id) return;
          if (
            !(
              new Date(p.purchaseDate) >= fromEpch &&
              new Date(p.purchaseDate) <= clsngEpch
            )
          ) {
            return;
          }

          totalPur += p.items.reduce((sum, item) => {
            if (fltrType !== "all" && item.asset.type !== fltrType) return sum;
            return sum + (item.qty || 0);
          }, 0);
        });
      });


      return opnngBal + totalPur + totalTin - totalTout - totalExpnd;
    } catch (error) {
      console.error("calcClosingBal error:", error);
      return null;
    }
  };

  const calcNetMvmntBal = (
    fltrType,
    from,
    to,
    purchaseList,
    inAst,
    outAst,
    baseId
  ) => {
    try {
      const fromEpch = new Date(from);
      const toEpch = new Date(to);
      let totalPur = 0;
      let totalTout = 0;
      let totalTin = 0;

      purchaseList.forEach((p) => {
        if (p.base !== baseId.base_id) return;
        if (
          !(
            new Date(p.purchaseDate) >= fromEpch &&
            new Date(p.purchaseDate) <= toEpch
          )
        ) {
          return;
        }

        totalPur += p.items.reduce((sum, item) => {
          if (fltrType !== "all" && item.asset.type !== fltrType) return sum;
          return sum + (item.qty || 0);
        }, 0);
      });
      outAst.forEach((o) => {
        if (
          o.by === baseId.id &&
          o.status === "RECEIVED" &&
          new Date(o.TOUTdate) >= fromEpch &&
          new Date(o.TOUTdate) <= toEpch
        ) {
          totalTout += o.astDtl.reduce((sum, ast) => {
            if (fltrType !== "all" && ast.category !== fltrType) return sum;
            return sum + (ast.totalQty?.value || 0);
          }, 0);
        }
      });

      inAst.forEach((i) => {
        if (
          i.to === baseId.id &&
          i.status === "RECEIVED" &&
          new Date(i.TINdate) >= fromEpch &&
          new Date(i.TINdate) <= toEpch
        ) {
          totalTin += i.astDtl.reduce((sum, ast) => {
            if (fltrType !== "all" && ast.category !== fltrType) return sum;
            return sum + (ast.totalQty?.value || 0);
          }, 0);
        }
      });
      const bal = totalPur + totalTin - totalTout;
      return bal;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  let asgnData =
    assignData?.flatMap(
      (e) =>
        e.items?.filter((a) => {
          if (formStt.category !== "all" && formStt.category !== a.category)
            return false;
          const asgnDate = new Date(a.asgnDate);
          if (formStt.from && formStt.to) {
            return (
              asgnDate >= new Date(formStt.from) &&
              asgnDate <= new Date(formStt.to)
            );
          }
          return true;
        }) ?? []
    ) ?? [];

  let expndAst = [];
  expndAst = assignData?.flatMap((ele) =>
    ele.items?.flatMap((a) => {
      let item = a.expnd.filter((exp) => {
        if (formStt.category !== "all" && formStt.category !== a.category)
          return false;
        const expDate = new Date(exp.expndDate);
        if (formStt.from && formStt.to) {
          return (
            expDate >= new Date(formStt.from) && expDate <= new Date(formStt.to)
          );
        }
        return true;
      });
      if (item.length === 0) return null;
      return { ...item[0], name: a.name };
    })
  );

  function handleHisStt(btnVal) {
    if (btnVal === "Purchase") {
      const fromDate = new Date(formStt.from);
      const toDate = new Date(formStt.to);

      const fmapVal = purchaseHistory.flatMap((v) => {
        const purDate = new Date(v.purchaseDate);

        const inRange = purDate >= fromDate && purDate <= toDate;

        if (!inRange) return [];

        return v.items
          .filter((e) => {
            if (formStt.category === "all") return true;
            const type =
              e.asset.type === "VCL"
                ? "Vehicle"
                : e.asset.type === "WEA"
                ? "Weapons"
                : "Ammunition";
            return type === formStt.category;
          })
          .map((e) => {
            const metric =
              e.asset.type === "VCL"
                ? "val"
                : e.asset.type === "WEA"
                ? "psc"
                : "boxes";

            return {
              date: v.purchaseDate,
              name: e.asset.name,
              qty: e.qty,
              metric,
            };
          });
      });
      setBtnHisState(fmapVal);
    }
    if (btnVal !== "Purchase") {
      let val = btnVal === "tin" ? TINdata : TOUTdata;

      let dataListBtn = val
        .filter((v) => {
          if (v.status !== "RECEIVED") return false;

          const expDate = new Date(btnVal === "tin" ? v.TINdate : v.TOUTdate);
          const fromDate = new Date(formStt.from);
          const toDate = new Date(formStt.to);
          const inRange = expDate >= fromDate && expDate <= toDate;

          if (!inRange) return false;

          if (formStt.category !== "all") {
            return v.astDtl.some((f) => f.category === formStt.category);
          }

          return true;
        })
        .flatMap((v) =>
          v.astDtl
            .filter(
              (f) =>
                formStt.category === "all" || f.category === formStt.category
            )
            .map((f) => ({
              name: f.name,
              qty: f.totalQty.value,
              metric: f.totalQty.metric,
              date: v.TOUTdate || v.TINdate,
            }))
        );

      setBtnHisState(dataListBtn);
    }
    hisModalRef.current.showModal();
  }

  return (
    <div
      className="container-fluid py-3"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #eef2f3)",
        minHeight: "100vh",
      }}
    >
      <SeeAllModal
        reference={hisModalRef}
        dataList={btnHisState}
        btnTitle={"Close"}
        btnfun={() => hisModalRef.current.close()}
        keyDate={"date"}
      />
      <form
        className="row gy-3 align-items-end border rounded-4 p-3 bg-white shadow-sm"
        action={formAcn}
      >
        <div className="col-12 col-md-3">
          <div className="form-floating">
            <select
              key={formStt?.category}
              className="form-select"
              id="floatingSelectGrid"
              name="category"
            >
              <option value="all">ALL</option>
              {itemType.map((i) => (
                <option key={i.code} value={i.name}>
                  {i.name}
                </option>
              ))}
            </select>
            <label htmlFor="floatingSelectGrid">Category</label>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label fw-bold">From</label>
          <input
            type="date"
            name="fromDate"
            defaultValue={formStt?.from}
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label fw-bold">To</label>
          <input
            type="date"
            name="toDate"
            defaultValue={formStt?.to}
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-3 d-grid">
          <button
            type="submit"
            className="btn btn-success fw-bold py-2 shadow-sm"
            disabled={isPending}
          >
            {isPending ? "Filtering..." : "Filter"}
          </button>
        </div>
      </form>

      {formStt?.from !== "" &&
      formStt?.to !== "" &&
      formStt?.category !== "" &&
      formStt?.err === "" ? (
        <div className="mt-4">
          <div className="row gy-3">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow rounded-4 bg-light-subtle">
                <div className="card-body text-center">
                  <h5 className="fw-bold text-secondary mb-2">
                    Opening Balance
                  </h5>
                  <h1 className="fw-bold text-success">
                    {dashMetric?.openingBal}
                  </h1>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow rounded-4 bg-light-subtle">
                <div className="card-body text-center">
                  <h5 className="fw-bold text-secondary mb-2">
                    Closing Balance
                  </h5>
                  <h1 className="fw-bold text-primary">
                    {dashMetric?.closingBal}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4 border-0 shadow rounded-4">
            <div className="card-body text-center">
              <h4 className="fw-bold mb-3 text-dark">Net Movement</h4>
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-outline-success border-2 fw-bold"
                  onClick={() => handleHisStt("Purchase")}
                >
                  Purchase
                </button>
                <span className="fs-5 fw-bold">+</span>
                <button
                  className="btn btn-outline-primary border-2 fw-bold"
                  onClick={() => handleHisStt("tin")}
                >
                  Transfer-IN
                </button>
                <span className="fs-5 fw-bold">−</span>
                <button
                  className="btn btn-outline-danger border-2 fw-bold"
                  onClick={() => handleHisStt("tout")}
                >
                  Transfer-OUT
                </button>
                <span className="fs-5 fw-bold">=</span>
                <h3 className="fw-bold text-warning mb-0">
                  {dashMetric?.NetMvmnt}
                </h3>
              </div>
            </div>
          </div>

          <div className="row mt-4 gy-3">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-body">
                  <h4 className="fw-bold text-secondary mb-3">
                    Assigned Assets
                  </h4>
                  {asgnData && asgnData.map((a) => {
                    return (
                      <div key={a._id} className="text-muted mb-1">
                        <span className="fw-semibold text-dark">{a.name}</span>{" "}
                        — Qty:{" "}
                        <span className="fw-bold">{a.totalQty.value}</span>{" "}
                        {a.totalQty.metric} on{" "}
                        {new Date(a.asgnDate).toLocaleDateString()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-body">
                  <h4 className="fw-bold text-secondary mb-3">
                    Expended Assets
                  </h4>
                  {expndAst && expndAst.map((exp) => {
                    if (exp === null) return;
                    return (
                      <div key={exp._id} className="text-muted fst-italic mb-1">
                        <span className="fw-semibold text-dark">
                          {exp.name}
                        </span>{" "}
                        — Used <span className="fw-bold">{exp.qty.value}</span>{" "}
                        {exp.qty.metric} on{" "}
                        <span className="text-secondary">
                          {new Date(exp.expndDate).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h3 className="text-muted fw-light">
            Select a date range and filter to view stats 📊
          </h3>
        </div>
      )}
    </div>
  );
}

export default DashboardStats;

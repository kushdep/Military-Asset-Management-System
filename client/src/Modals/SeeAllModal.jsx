import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function SeeAllModal({
  reference,
  dataList,
  btnfun,
  title,
  btnTitle,
  isBtnSecGrp,
  keyName,
  keyDate,
}) {
  const [selSldrList, setSelSldrList] = useState([]);
  const [selSldrId, setSldrId] = useState("");

  useEffect(() => {
    if (!isBtnSecGrp) {
      setSelSldrList([...dataList]);
    }
  }, [isBtnSecGrp, dataList]);

  function handleSelSldr(id) {
    const selList = dataList.find((e) => e[keyName] === id);
    if (selList) {
      setSelSldrList([
        ...(selList.Vehicle || []),
        ...(selList.Ammunition || []),
        ...(selList.Weapons || []),
      ]);
      setSldrId(selList[keyName]);
    }
  }

  return createPortal(
    <dialog
      ref={reference}
      className="w-100 w-md-75 w-lg-50 p-3 p-md-4 rounded-4 shadow border-0"
      style={{ maxWidth: "700px" }}
    >
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn-close"
          onClick={() => reference.current.close()}
          aria-label="Close"
        ></button>
      </div>

      {isBtnSecGrp ? (
        <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
          {dataList.slice(0, 2).map((e) => (
            <button
              key={e[keyName]}
              className={`btn ${selSldrId === e[keyName] ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => handleSelSldr(e[keyName])}
            >
              {e[keyName]}
            </button>
          ))}

          {dataList.length > 2 && (
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu">
                {dataList.slice(2).map((item) => (
                  <li key={item[keyName]}>
                    <button
                      className={`btn ${selSldrId === item[keyName] ? "btn-primary" : "btn-outline-primary"} dropdown-item`}
                      onClick={() => handleSelSldr(item[keyName])}
                    >
                      {item[keyName]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <h3 className="text-center mb-3">{title}</h3>
      )}

      <div
        className="container p-3 border rounded-4"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <h4 className="fw-bold text-center text-decoration-underline mb-3">
          {selSldrId || ""}
        </h4>
        <div className="row g-2">
          {selSldrList?.length > 0 ? (
            selSldrList.map((d, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-md-4">
                <div className="border rounded-3 p-2 d-flex flex-column gap-1">
                  <p className="fw-bold mb-0">{d.name}</p>
                  <small className="text-muted">
                    {d.qty} ({d.metric})
                    {keyDate && d[keyDate] && " - " + new Date(d[keyDate]).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="col">
              <div className="border rounded-3 p-2 text-center text-muted">
                {isBtnSecGrp ? "Choose any id to see assets" : "No data"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-3">
        <button
          className="btn btn-success w-50 fw-bold"
          disabled={isBtnSecGrp ? !selSldrId : false}
          onClick={() => {
            if (isBtnSecGrp) {
              btnfun(selSldrId);
              setSldrId("");
            } else {
              btnfun();
            }
          }}
        >
          {btnTitle}
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default SeeAllModal;

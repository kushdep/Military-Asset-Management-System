import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function SeeAllModal({
  reference,
  dataList,
  btnfun,
  title,
  btnTitle,
  isBtnSecGrp,
}) {
  const [selSldrList, setSelSldrList] = useState([]);
  const [selSldrId, setSldrId] = useState("");

  useEffect(() => {
    if (!isBtnSecGrp) setSelSldrList(dataList);
  }, [isBtnSecGrp, dataList]);

  function handleSelSldr(id) {
    const selList = dataList.find((e) => e.sldrId === id);
    if (selList)
      setSelSldrList([
        ...(selList.Vehicle || []),
        ...(selList.Ammunition || []),
        ...(selList.Weapons || []),
      ]);
    setSldrId(id);
  }

  return createPortal(
    <dialog ref={reference} className="shadow rounded-4 p-4">
      <button
        type="submit"
        className="btn-close mb-3"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={() => reference.current.close()}
      ></button>
      {isBtnSecGrp ? (
        <div
          className="btn-group"
          role="group"
          aria-label="Button group with nested dropdown"
        >
          {dataList.slice(0, 2).map((e) => (
            <button
              key={e.sldrId}
              className={`btn ${
                selSldrId === e.sldrId ? "btn-primary" : " btn-outline-primary"
              }`}
              onClick={() => handleSelSldr(e.sldrId)}
            >
              {e.sldrId}
            </button>
          ))}

          {dataList.length > 2 && (
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu">
                {dataList.slice(2).map((item) => (
                  <li key={item.sldrId}>
                    <button
                      className={`btn ${
                        selSldrId === item.sldrId
                          ? "btn-primary"
                          : " btn-outline-primary"
                      } dropdown-item`}
                      onClick={() => handleSelSldr(item.sldrId)}
                    >
                      {item.sldrId}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <h3>{title}</h3>
      )}

      <div className="container p-4 border rounded-4">
        <div className="row mb-2 d-flex flex-column">
          <h4 className="fw-bold text-center text-decoration-underline">
            {selSldrId !== "" && selSldrId}
          </h4>
          {selSldrId !== "" && selSldrList?.length !== 0 ? (
            selSldrList.map((d) => {
              return (
                <div className="col border rounded-3 mb-3">
                  <div className="d-flex flex-row gap-5 p-2">
                    <p className="fw-bold">{d.name}</p>
                    <p className="text-muted">
                      {d.qty} ({d.metric})
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col border rounded-3 mb-3">
              {isBtnSecGrp ? "Choose any id to see assets" : "No data"}
            </div>
          )}
        </div>
      </div>
      <div className="col text-center mt-3">
        <button
          className="btn btn-success w-50 fw-bold"
          disabled={isBtnSecGrp ? (selSldrId!==''?false:true):false}
          onClick={() => {
            if (isBtnSecGrp) {
              btnfun(selSldrId);
              setSldrId("")
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

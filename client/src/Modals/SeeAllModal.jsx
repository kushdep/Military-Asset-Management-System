import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function SeeAllModal({
  reference,
  dataList,
  btnfun,
  title,
  btnTitle,
  isBtnSecGrp,
  keyName
}) {
  const [selSldrList, setSelSldrList] = useState([]);
  const [selSldrId, setSldrId] = useState("");
  console.log(keyName)

  useEffect(() => {
    if (!isBtnSecGrp) setSelSldrList(dataList);
  }, [isBtnSecGrp, dataList]);

  function handleSelSldr(id) {
    console.log(id)
    const selList = dataList.find((e) => e[keyName] === id);
    console.log(selList)
    if (selList){
      setSelSldrList([
        ...(selList.Vehicle || []),
        ...(selList.Ammunition || []),
        ...(selList.Weapons || []),
      ]);
    setSldrId(selList[keyName]);
    }
  }
  console.log(dataList)

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
          {dataList.slice(0, 2).map((e) => {
            console.log(e)
            console.log(e[keyName])
            return <button
              key={e[keyName]}
              className={`btn ${
                selSldrId === e[keyName] ? "btn-primary" : " btn-outline-primary"
              }`}
              onClick={() => handleSelSldr(e[keyName])}
            >
              {e[keyName]}
            </button>
})}

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
                  <li key={item[keyName]}>
                    <button
                      className={`btn ${
                        selSldrId === item[keyName]
                          ? "btn-primary"
                          : " btn-outline-primary"
                      } dropdown-item`}
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

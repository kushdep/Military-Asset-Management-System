import { createPortal } from "react-dom";

function SeeAllModal({ reference, dataList, btnfun, title, btnTitle }) {
  console.log(dataList);
  console.log(title);
  return createPortal(
    <dialog ref={reference} className="shadow rounded-4 p-4">
      <form method="dialog" className="d-flex gap-5">
        <button
          type="submit"
          className="btn-close mb-3"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        <h3>{title}</h3>
      </form>

      <div className="container p-4 border rounded-4">
        <div className="row mb-2 d-flex flex-column">
          {dataList?.length!==0 ? dataList.map((d) => {
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
          }):
        <div className="col border rounded-3 mb-3">
            No data
        </div>
          }
        </div>
      </div>
      <div className="col text-center mt-3">
        <button className="btn btn-success w-50 fw-bold" onClick={btnfun}>
          {btnTitle}
        </button>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
}

export default SeeAllModal;

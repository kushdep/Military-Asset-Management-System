import { useState } from "react";

const AddNewAsset = ({ types = [], onAdd }) => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("");

  return (
    <div className="container-fluid border p-2 rounded-3">
      <div className="row">
        <div className="col-9">
          <div className="d-flex flex-row gap-2">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="assetName"
                placeholder="Asset Name"
                //   value={name}
                //   onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="assetName">Asset Name</label>
            </div>
            <div className="form-floating">
              <select
                className="form-select"
                id="assetType"
                //   value={type}
                //   onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select Type</option>
                {/* {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))} */}
              </select>
              <label htmlFor="assetType">Type</label>
            </div>
          </div>
          <div className="d-flex flex-row gap-2 mt-2">
            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                id="assetQty"
                placeholder="Quantity"
                //   value={qty}
                //   onChange={(e) => setQty(e.target.value)}
              />
              <label htmlFor="assetQty">Quantity</label>
            </div>

            <div className="form-floating">
              <select
                className="form-select"
                id="assetType"
                //   value={type}
                //   onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select metric</option>
                {/* {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))} */}
              </select>
              <label htmlFor="assetType">Metric</label>
            </div>
          </div>
        </div>
        <div className="col-3 d-flex flex-column gap-1 justify-content-center">
            <button className="btn btn-dark">Add</button>
            <button className="btn btn-danger">Remove</button>
        </div>
        </div>
    </div>
  );
};

export default AddNewAsset;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseActions, getBaseData, getBaseIds } from "../store/base-slice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.authData);
  const { baseIds, actvId } = useSelector((state) => state.baseData);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      role === "AD" &&
      Object.keys(actvId).length === 0 &&
      baseIds?.length === 0
    ) {
      console.log("inside");
      dispatch(getBaseIds(token));
    } else {
      //call for particular base dashboard
    }
  }, []);
  console.log(baseIds);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">
            {Object.keys(actvId).length === 0 && (
              <div className="form-floating">
                <select
                  className="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  disabled={baseIds.length === 0}
                  onChange={(e) => {
                    if (e.target.value > 0) {
                      console.log("calling");
                      dispatch(getBaseData(token, e.target.value));
                      navigate(`/dashboard/${e.target.value}/purchase`);
                    }
                  }}
                >
                  <option value="0" selected>
                    Choose Base name
                  </option>
                  {baseIds.map((e) => {
                    return <option value={e.baseId}>{e.baseName}</option>;
                  })}
                </select>
                <label htmlFor="floatingSelect">Select Base</label>
              </div>
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col"></div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

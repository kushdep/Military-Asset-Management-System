import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseActions, getBaseIds } from "../store/base-slice";

function Dashboard() {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.authData);
  const { baseIds, baseData } = useSelector((state) => state.baseData);

  useEffect(() => {
      // const token = localStorage.getItem('token')
      console.log(token)
      // const role ='AD'
    if (role === "AD" && baseData.length === 0 && baseIds.length === 0) {
        console.log("calling for ids")
      dispatch(getBaseIds(token));
    } else {
      //call for particular base dashboard
    }
  }, []);
  console.log(baseIds)
  return (
    <>
      <div className="container-fluid border">
        <div className="row">
          <div className="col">
            <div className="form-floating">
              <select
                className="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
                disabled={baseIds.length === 0}
              >
                {baseIds.map((e) => {
                  return <option value={e.baseNo}>{e.baseName}</option>;
                })}
              </select>
              <label htmlFor="floatingSelect">Select Base</label>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;

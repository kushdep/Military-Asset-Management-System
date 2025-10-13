import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseActions, getBaseData, getBaseIds } from "../store/base-slice";
import { useNavigate, useParams } from "react-router-dom";
import DashboardStats from "../components/DashboardStats";

function Dashboard() {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.authData);
  const { baseIds, actvId } = useSelector((state) => state.baseData);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (role === "AD" && baseIds.length === 0) {
      dispatch(getBaseIds(token));
    } else if (role !== "AD") {
      const baseIdToUse = id ?? actvId.id;

      console.log(id)
      console.log(actvId.id)
      if (!baseIdToUse) {
        navigate("/login");
        return;
      }
    
      console.log(baseIdToUse)
      dispatch(getBaseData(token, baseIdToUse));
      navigate(`/dashboard/${baseIdToUse}`);
    }

  }, [role, id, actvId, baseIds, token, navigate]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">
            {role === "AD" && (
              <div className="form-floating">
                <select
                  className="form-select mt-2"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  disabled={baseIds.length === 0}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      const base = baseIds.find(
                        (f) => f.baseId === e.target.value
                      );
                      dispatch(getBaseData(token, base.baseId));
                      dispatch(
                        baseActions.setActId({ id: base.baseId, _id: base._id })
                      );
                      navigate(`/dashboard/${base.baseId}`);
                    }
                  }}
                >
                  <option value="" selected>
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
      {actvId?.id !== "" ? (
        <DashboardStats />
      ) : (
        <h1 className="text-muted text-center">Select Base</h1>
      )}
    </>
  );
}

export default Dashboard;

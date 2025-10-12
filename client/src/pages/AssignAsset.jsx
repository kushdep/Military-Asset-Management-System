import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import AssignmentModal from "../Modals/AssignmentModal";
import { getBaseData } from "../store/base-slice";
import { assignActions } from "../store/assign-slice";
import SeeAllModal from "../Modals/SeeAllModal";
import axios from "axios";
import ExpendAssetModal from "../Modals/ExpendAssetModal";
import AsgnExpndhistory from "../components/AsgnExpndHistory";

function AssignAsset() {
  const { id: baseId } = useParams();
  const { token, role } = useSelector((state) => state.authData);
  const { sldrsData, invtry, assignData } = useSelector((state) => state.baseData);
  const { pageState, asgnAst } = useSelector((state) => state.assignData);

  const dispatch = useDispatch();
  const assigModalRef = useRef();
  const expendModalRef = useRef();
  const seeAllModalRef = useRef();

  useEffect(() => {
    if (!sldrsData || !invtry) {
      dispatch(getBaseData(token, baseId));
    }
  }, [sldrsData]);

  async function AddAsgnData(id) {
    const { Vehicle, Ammunition, Weapons } = asgnAst.find(e => e.sldrId === id);
    const body = { sldrId: id, asgnAst: { Vehicle, Ammunition, Weapons } };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${baseId}/assign-asset`,
        body,
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Asset Assigned Successfully");
        dispatch(assignActions.resetAssgnData({ selSldrId: id }));
        dispatch(getBaseData(token, baseId));
      }
      if (response.status === 400) {
        toast.error("Assignment Not possible");
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
      return;
    }
    asgnAst.length === 0 && seeAllModalRef.current.close();
  }

  const assignSldr = [];
  if (pageState === "expenditure" && assignData) {
    assignData.forEach(el => {
      if (!assignSldr.includes(el.sId)) assignSldr.push(el.sId);
    });
  }

  return (
    <>
      <AssignmentModal reference={assigModalRef} />
      <ExpendAssetModal reference={expendModalRef} />
      <SeeAllModal
        reference={seeAllModalRef}
        dataList={asgnAst}
        btnfun={AddAsgnData}
        isBtnSecGrp={true}
        btnTitle="Assign"
        keyName="sldrId"
      />

      <div className="container-fluid mt-2">
        <div className="row">
          <div className="col-12 col-md-2 mb-3 mb-md-0 d-flex flex-row flex-md-column gap-2">
            <button
              onClick={() => dispatch(assignActions.setPageState("assign"))}
              className={`btn fw-bold w-100 ${pageState === "assign" ? "btn-dark" : "btn-outline-dark"}`}
            >
              Assignment
            </button>

            {role !== "COM" && (
              <button
                onClick={() => dispatch(assignActions.setPageState("expenditure"))}
                className={`btn fw-bold w-100 ${pageState === "expenditure" ? "btn-dark" : "btn-outline-dark"}`}
              >
                Expenditure
              </button>
            )}

            <button
              onClick={() => dispatch(assignActions.setPageState("history"))}
              className={`btn fw-bold w-100 ${pageState === "history" ? "btn-dark" : "btn-outline-dark"}`}
            >
              History
            </button>
          </div>

          <div className="col-12 col-md-10">
            <div className="d-flex justify-content-end mb-2">
              {asgnAst.length > 0 && (
                <button
                  className="btn fw-bold text-success text-decoration-underline"
                  onClick={() => seeAllModalRef.current.showModal()}
                >
                  See Added Assets
                </button>
              )}
            </div>

            {pageState === "history" ? (
              <AsgnExpndhistory />
            ) : pageState === "assign" ? (
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>SId</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sldrsData?.map(s => (
                      <tr key={s._id}>
                        <th scope="row">{s.sId}</th>
                        <td>{s.name}</td>
                        <td>{s.gender}</td>
                        <td>{s.age}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            disabled={!Object.keys(invtry).length}
                            onClick={() => {
                              dispatch(assignActions.setSelSldr({ id: s.sId, name: s.name }));
                              assigModalRef.current.showModal();
                            }}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>SId</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignSldr.map(s => (
                      <tr key={s}>
                        <th scope="row">{s}</th>
                        <td>
                          <button
                            className="btn btn-outline-success btn-sm fw-bold"
                            onClick={() => {
                              dispatch(assignActions.setSelSldr({ id: s, name: "" }));
                              expendModalRef.current.showModal();
                            }}
                          >
                            See Assigned Assets
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignAsset;

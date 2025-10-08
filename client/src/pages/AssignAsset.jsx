import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import AssignmentModal from "../Modals/AssignmentModal";
import { useEffect } from "react";
import { getBaseData } from "../store/base-slice";
import { assignActions } from "../store/assign-slice";
import SeeAllModal from "../Modals/SeeAllModal";
import axios from "axios";
import ExpendAssetModal from "./ExpendAssetModal";

function AssignAsset() {
  const { id: baseId } = useParams();
  const { token } = useSelector((state) => state.authData);
  const { sldrsData, invtry, assignData } = useSelector(
    (state) => state.baseData
  );
  const { pageState, asgnAst } = useSelector((state) => state.assignData);

  const dispatch = useDispatch();
  const assigModalRef = useRef();
  const expendModalRef = useRef();
  const seeAllModalRef = useRef();

  useEffect(() => {
    if (sldrsData === null || invtry === null) {
      dispatch(getBaseData(token, baseId));
    }
  }, [sldrsData]);

  console.log(baseId);
  async function AddAsgnData(id) {
    console.log(id);
    const { Vehicle, Ammunition, Weapons } = asgnAst.find(
      (e) => e.sldrId === id
    );
    const body = {
      sldrId: id,
      asgnAst: { Vehicle, Ammunition, Weapons },
    };
    console.log(body);
    try {
      console.log(baseId);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${baseId}/assign-asset`,
        body,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
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
      if (error.response.status === 500) {
        toast.error("Something went wrong");
      }
      return;
    }
    asgnAst.length === 0 && seeAllModalRef.current.close();
  }

  let assignSldr = [];
  if (pageState === "expenditure" && assignData !== null) {
    assignData.forEach((element) => {
      if (!assignSldr.includes(element.sId)) {
        assignSldr.push(element.sId);
      }
    });
  }

  return (
    <>
      <div className="container-fluid">
        <AssignmentModal reference={assigModalRef} />
        <ExpendAssetModal reference={expendModalRef}/>
        <SeeAllModal
          reference={seeAllModalRef}
          dataList={asgnAst}
          btnfun={AddAsgnData}
          isBtnSecGrp={true}
          btnTitle="Assign"
        />
        <div className="row mt-2">
          <div className="col-1 p-2 d-flex flex-column gap-2">
            <button
              onClick={() => dispatch(assignActions.setPageState("assign"))}
              className={`btn fw-bold p-2 ${
                pageState === "assign"
                  ? "active btn-success"
                  : "btn-outline-success"
              }`}
            >
              Assignment
            </button>
            <button
              onClick={() =>
                dispatch(assignActions.setPageState("expenditure"))
              }
              className={`btn fw-bold p-2 ${
                pageState === "expenditure"
                  ? "active btn-success"
                  : "btn-outline-success"
              }`}
            >
              Expenditure
            </button>
            <button
              onClick={() => dispatch(assignActions.setPageState("history"))}
              className={`btn fw-bold p-2 ${
                pageState === "history"
                  ? "active btn-success"
                  : "btn-outline-success"
              }`}
            >
              History
            </button>
          </div>
          <div className="col">
            <div className="d-flex flex-row-reverse">
              {asgnAst.length > 0 && (
                <button
                  className="btn fw-bold text-success text-decoration-underline"
                  onClick={() => {
                    seeAllModalRef.current.showModal();
                  }}
                >
                  See Added Assets
                </button>
              )}
            </div>
            {pageState === "history" ? (
              <h1>HIstory</h1>
            ) : pageState === "assign" ? (
              <table className="table border border-black mt-3">
                <thead>
                  <tr>
                    <th scope="col">SId</th>
                    <th scope="col">Name</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Age</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider border">
                  {sldrsData !== null &&
                    sldrsData.map((s, i) => {
                      return (
                        <tr key={s._id}>
                          <th scope="row">{s.sId}</th>
                          <td>{s.name}</td>
                          <td>{s.gender}</td>
                          <td>{s.age}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              disabled={Object.keys(invtry).length === 0}
                              onClick={() => {
                                dispatch(
                                  assignActions.setSelSldr({
                                    id: s.sId,
                                    name: s.name,
                                  })
                                );
                                assigModalRef.current.showModal();
                              }}
                            >
                              Assign
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>{" "}
              </table>
            ) : (
              <table className="table border border-black mt-3 text-center">
                <thead>
                  <tr>
                    <th scope="col">SId</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider border">
                  {assignSldr.length > 0 &&
                    assignSldr.map((s, i) => {
                      

                      return (
                        <tr key={s}>
                          <th className={"col"} scope="row">
                            {s}
                          </th>
                          <td>
                            <button
                              className="btn btn-outline-success fw-bold"
                              onClick={() => {
                                dispatch(
                                  assignActions.setSelSldr({
                                    id: s,
                                    name: "",
                                  })
                                );
                                expendModalRef.current.showModal();
                              }}
                            >
                              See Assigned Assets
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignAsset;

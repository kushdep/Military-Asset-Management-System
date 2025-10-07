import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import AssignmentModal from "../Modals/AssignmentModal";
import { useEffect } from "react";
import { getBaseData } from "../store/base-slice";
import { assignActions } from "../store/assign-slice";
import SeeAllModal from "../Modals/SeeAllModal";
import axios from "axios";

function AssignAsset() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.authData);
  const { sldrsData, invtry } = useSelector((state) => state.baseData);
  const { pageState, asgnAst, selSldr } = useSelector(
    (state) => state.assignData
  );

  const dispatch = useDispatch();
  const assigModalRef = useRef();
  const seeAllModalRef = useRef();

  useEffect(() => {
    if (sldrsData === null) {
      dispatch(getBaseData(token, id));
    }
  }, [sldrsData]);

  async function AddAsgnData() {
    const body = {
      sldrId: selSldr.id,
      asgnAst,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/dashboard/${id}/assign-asset`,
        body,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Asset Assigned Successfully");
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
    reference.current.close();
  }

  return (
    <>
      <div className="container-fluid">
        <AssignmentModal reference={assigModalRef} />
        <SeeAllModal
          reference={seeAllModalRef}
          dataList={[...asgnAst.Vehicle,...asgnAst.Weapons,...asgnAst.Ammunition]}
          btnfun={AddAsgnData}
          title={`Assign to ${selSldr?.name}`}
          btnTitle="Assign"
        />
        <div className="row mt-2">
          <div className="col-1 p-2 d-flex flex-column gap-2">
            <button
              className={`btn ${
                pageState === "assign"
                  ? "active btn-success"
                  : "btn-outline-success"
              }`}
            >
              Assignment
            </button>
            <button
              className={`btn ${
                pageState === "expenditure"
                  ? "active btn-success"
                  : "btn-outline-success"
              }`}
            >
              Expenditure
            </button>
          </div>
          <div className="col">
            <div className="d-flex flex-row-reverse">
              {(asgnAst.Vehicle.length > 0 ||
                asgnAst.Ammunition.length > 0 ||
                asgnAst.Weapons.length > 0) && (
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignAsset;

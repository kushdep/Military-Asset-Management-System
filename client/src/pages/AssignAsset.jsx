import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useLocation, useParams } from "react-router-dom";
import AssignmentModal from "../Modals/AssignmentModal";

function AssignAsset() {
  const location = useLocation()
  const {id} = useParams
  const { purchsData,sldrsData,invtry } = useSelector((state) => state.baseData);
  const [filter, setFilter] = useState({
    type: "",
    date: { fromDate: "", toDate: "" },
  });
  const fromInp = useRef();
  const toInp = useRef();
  const [selSldr,setSelSldr] = useState({id:'',name:''})
  const assigModalRef = useRef()

  function setTypeFilter(typeVal) {
    setFilter((prev) => {
      if (typeVal === "NF") {
        return { ...prev, type: "" };
      }
      return { ...prev, type: typeVal };
    });
  }

  function setDateFilter() {
    const to = new Date(toInp.current.value).getTime();
    const from = new Date(fromInp.current.value).getTime();
    if (from > to) {
      toast.error("Choose valid dates");
      toInp.current.value = "";
      fromInp.current.value = "";
      return;
    }

    setFilter((prev) => {
      return {
        ...prev,
        date: {
          fromDate: fromInp.current.value,
          toDate: toInp.current.value,
        },
      };
    });
  }
  console.log(filter);
  console.log(sldrsData);
  return (
    <>
      <div className="container-fluid">
        <AssignmentModal reference={assigModalRef} sldr={selSldr}/>
        <div className="row mt-2">
          <div className="col-1 p-2 d-flex flex-column gap-2">
            <Link
              to={`/dashboard/${id}/assign`}
              className={`btn ${
                location.pathname.includes("/assign") ? "active btn-success" : "btn-dark"
              }`}
            >
              Assignment
            </Link>
            <Link
              to={`/dashboard/${id}/expenditure`}
              className={`btn ${
                location.pathname.includes("/expenditure") ? "active btn-success" : "btn-dark"
              }`}
            >
              Expenditure
            </Link>
          </div>
          <div className="col">
            <table className="table border border-black">
              <thead>
                <tr>
                  <th scope="col">SId</th>
                  <th scope="col">Name</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Age</th>
                  <th scope="col">Rank</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className="table-group-divider border">
                {sldrsData.map((s,i)=>{
                    return <tr key={s._id}>
                        <th scope="row">{s.sId}</th>
                        <td>{s.name}</td>
                        <td>{s.gender}</td>
                        <td>{s.age}</td>
                        <td>{s.rank}</td>
                        <td>
                          <button className="btn btn-primary" disabled={Object.keys(invtry).length===0} onClick={()=>{
                                setSelSldr({id:s.sId,name:s.name})
                              assigModalRef.current.showModal()
                          }
                            }>Assign</button>
                        </td>
                      </tr>
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

import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { baseActions } from "../store/base-slice";

const Navbar = () => {
  const { actvId } = useSelector((state) => state.baseData);
  const { role } = useSelector((state) => state.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top w-100 rounded-pill mt-1 shadow">
        <div className="container-fluid">
          <div className="row w-100">
            <div className="col-2 d-flex justify-content-center">
              <Link
                className="navbar-brand d-flex align-items-center"
                to="/dashboard"
              >
                <img
                  src="/icons/logo.png"
                  alt="Logo"
                  width="40"
                  height="40"
                  className="d-inline-block align-top me-2 rounded-5 p-1 bg-light"
                />
                <span className="fw-bold fs-5 text-light">MAMS</span>
              </Link>
            </div>
            <div
              className="collapse navbar-collapse col-8 d-flex justify-content-center"
              id="navbarSupportedContent"
            >
              <div className="border rounded-5 p-1 bg-light shadow-lg">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-around gap-3 ">
                  <li className="nav-item">
                    <NavLink
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "nav-link fw-bold border rounded-pill bg-dark text-light shadow-lg"
                          : "nav-link fw-bold text-dark"
                      }
                      to={
                        role !== "AD"
                          ? `/dashboard/${actvId.id}`
                          : !!actvId.id
                          ? `/dashboard/${actvId.id}`
                          : "/dashboard"
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive && !!actvId.id
                          ? "nav-link fw-bold border rounded-pill bg-dark text-light shadow-lg"
                          : "nav-link fw-bold text-dark"
                      }
                      to={
                        !!actvId.id ? `/dashboard/${actvId.id}/purchase` : "#"
                      }
                    >
                      Purchase
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive && !!actvId.id
                          ? "nav-link fw-bold border rounded-pill bg-dark text-light shadow-lg"
                          : "nav-link fw-bold text-dark"
                      }
                      to={!!actvId.id ? `/dashboard/${actvId.id}/assign` : "#"}
                    >
                      Assign
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive && !!actvId.id
                          ? "nav-link fw-bold border rounded-pill bg-dark text-light shadow-lg"
                          : "nav-link fw-bold text-dark"
                      }
                      to={!!actvId.id ? `/dashboard/${actvId.id}/transfer` : ""}
                    >
                      Transfer
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-end col-2"
              id="navbarNav"
            >
              <ul className="navbar-nav align-items-lg-center">
                <li className="nav-item mx-2">
                  <button
                    className="btn btn-outline-light px-3"
                    onClick={() => {
                      dispatch(authActions.logout());
                      navigate("/login");
                      dispatch(baseActions.setActId({id:null,_id:null}));
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

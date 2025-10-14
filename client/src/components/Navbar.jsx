import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { baseActions } from "../store/base-slice";
import { purchaseActions } from "../store/purchase-slice";

const Navbar = () => {
  const { actvId } = useSelector((state) => state.baseData);
  const { role } = useSelector((state) => state.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top py-2 px-3 rounded-pill mt-2">
      <div className="container-fluid">

        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img
            src="https://res.cloudinary.com/demncxfgx/image/upload/v1760402383/shield_12843636_uawqza.png"
            alt="Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2 rounded-5 p-1 bg-light"
          />
          <span className="fw-bold fs-5 text-light">MAMS</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto my-2 my-lg-0 d-flex align-items-center gap-2 bg-light p-2 rounded-5 shadow-sm">
            <li className="nav-item">
              <NavLink
                end
                className={({ isActive }) =>
                  isActive
                    ? "nav-link fw-bold border rounded-pill bg-dark text-light px-3 shadow-sm"
                    : "nav-link fw-bold text-dark px-3"
                }
                to={
                  role !== "AD"
                    ? `/dashboard/${actvId?.id}`
                    : !!actvId?.id
                    ? `/dashboard/${actvId?.id}`
                    : "/dashboard"
                }
              >
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive && !!actvId?.id
                    ? "nav-link fw-bold border rounded-pill bg-dark text-light px-3 shadow-sm"
                    : "nav-link fw-bold text-dark px-3"
                }
                to={!!actvId?.id ? `/dashboard/${actvId?.id}/purchase` : "#"}
              >
                Purchase
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive && !!actvId?.id
                    ? "nav-link fw-bold border rounded-pill bg-dark text-light px-3 shadow-sm"
                    : "nav-link fw-bold text-dark px-3"
                }
                to={!!actvId?.id ? `/dashboard/${actvId?.id}/assign` : "#"}
              >
                Assign
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive && !!actvId?.id
                    ? "nav-link fw-bold border rounded-pill bg-dark text-light px-3 shadow-sm"
                    : "nav-link fw-bold text-dark px-3"
                }
                to={!!actvId?.id ? `/dashboard/${actvId?.id}/transfer` : "#"}
              >
                Transfer
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center mt-3 mt-lg-0">
            <li className="nav-item">
              <button
                className="btn btn-outline-light px-3"
                onClick={() => {
                  dispatch(authActions.logout());
                  navigate("/login");
                  dispatch(baseActions.setActId({ id: '', _id: '' }));
                  dispatch(baseActions.resetBaseData());
                  dispatch(purchaseActions.resetPurchaseData());
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

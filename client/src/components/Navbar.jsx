import "bootstrap/dist/css/bootstrap.min.css";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const {  baseData } = useSelector((state) => state.baseData);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top w-100 rounded-pill">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="/icons/store.png"
              alt="Logo"
              width="40"
              height="40"
              className="d-inline-block align-top me-2 rounded-circle"
            />
            <span className="fw-bold fs-5 text-light">MAMS</span>
          </a>
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
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-lg-center">
              <li className="nav-item mx-2">
                <button
                  className="btn btn-light px-3"
                  onClick={() => {
                    navigate('/dashboard/purchase')
                  }}
                  disabled={baseData.length===0}
                >
                  Purchase  
                </button>
              </li>
              <li className="nav-item mx-2">
                <button
                  className="btn btn-outline-light px-3"
                  onClick={() => {
                    dispatch(authActions.logout())
                    navigate('/login')
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

import "bootstrap/dist/css/bootstrap.min.css";
import { useRef } from "react";

const Navbar = () => {
  const authref = useRef();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 fixed-top w-100">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="/icons/store.png"
              alt="Logo"
              width="40"
              height="40"
              className="d-inline-block align-top me-2 rounded-circle"
            />
            <span className="fw-bold fs-5 text-light">MyShop</span>
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
                    setLoginStt(true);
                    authref.current.showModal();
                  }}
                >
                  Purchase
                </button>
              </li>
              <li className="nav-item mx-2">
                <button
                  className="btn btn-outline-light px-3"
                  onClick={() => {
                    setLoginStt(true);
                    authref.current.showModal();
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

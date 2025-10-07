import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  return (
    <div className="container-fluid d-flex flex-column">
      <Toaster  position="top-right" toastOptions={{style: {zIndex: 99999,}}}/>
      <div className="row">
        <div className="col">
          <Navbar />
        </div>
      </div>
      <main className="row mx-2 rounded-5 mt-3 vh-100 shadow-lg mb-3">
        <div className="col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <Toaster />
      <div className="row">
        <div className="col">
          <Navbar />
        </div>
      </div>
      <main className="row">
        <div className="col">
        <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;

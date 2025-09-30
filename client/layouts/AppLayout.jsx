import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  return (
    <div className="">
      <Navbar/>
      <Toaster />
      <Outlet />
    </div>
  );
}

export default AppLayout;

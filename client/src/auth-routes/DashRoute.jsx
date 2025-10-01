import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null; 
  }

  return children;
};

export default DashRoute;

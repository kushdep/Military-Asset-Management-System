import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return null;
};

export default LoginRoute;

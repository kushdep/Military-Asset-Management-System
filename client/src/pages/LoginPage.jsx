import { useActionState } from "react";
import toast from "react-hot-toast";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";

function LoginPage() {
  const [formState, formFn, isPending] = useActionState(action, {
    email: null,
    errors:[]
  });
    const { isAuthenticated, token,role } = useSelector((state) => state.authData);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log(isAuthenticated)
  console.log(token)
  console.log(role)
   async function action(currentState, formData) {
    try {
      const email = formData.get("email");
      const password = formData.get("password");
      const body = {
        email,
        password,
      };

      console.log(body);
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`,body);
        console.log(response);
        if (response.status === 200) {
          toast.success("Logged In");
          dispatch(authActions.loginSuccess({ token: response.data.token,role:response.data.role }))
          navigate("/dashboard");
        }
      } catch (error) {
        let err = [];
        if (error?.response?.status === 500) {
            toast.error('Something went wrong')
          return {
            ...currentState,
            email,
          };
        }
        if (error?.response?.status === 400) {
          err.push(error?.response?.data?.message);
          return {
            ...currentState,
            email,
            errors: err,
          };
        }
        if (error?.response?.status === 401) {
          err.push(error?.response?.data?.message);
          return {
            ...currentState,
            errors: err,
          };
        }
        if (error?.response?.status === 402) {
          err.push(error?.response?.data?.message);
          return {
            ...currentState,
            errors: err,
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container w-100 border">
      <div className="row">
        <form action={formFn} className="col">
          <div className="col mb-4">
            <h2 className="fw-bold text-dark">Welcome Back 👋</h2>
            <p className="text-muted small">
              Please log in to continue
            </p>
            <p className="text-danger">{formState?.errors[0]}</p>
          </div>
          <div className="col mb-3">
            <div className="form-floating">
              <input
                type="email"
                name="email"
                className="form-control rounded-3 shadow-sm"
                id="floatingInput"
                placeholder="name@example.com"
                defaultValue={formState?.email}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
          </div>

          <div className="col mb-3">
            <div className="form-floating">
              <input
                type="password"
                name="password"
                className="form-control rounded-3 shadow-sm"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
          </div>

          <div className="col mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold py-2 rounded-3 shadow-sm"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

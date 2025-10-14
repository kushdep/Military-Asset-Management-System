import { useActionState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import { baseActions, getBaseIds } from "../store/base-slice";

function LoginPage() {
  const [formState, formFn, isPending] = useActionState(action, {
    email: null,
    errors: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = (message) => toast.error(message);

  async function action(currentState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const body = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/login`,
        body
      );
      if (response?.status === 200) {
        const { token, role, name, baseInfo } = response.data;
        if (!token || !role) {
          notify("Something Went Wrong");
          return;
        }
        if (role === "AD") {
          dispatch(
            authActions.loginSuccess({ token: token, role: role, name: name })
          );
          dispatch(getBaseIds(token));
          navigate("/dashboard");
          return;
        }

        if (!baseInfo || Object.keys(baseInfo).length === 0) {
          notify("Something went wrong");
          return;
        }
        dispatch(baseActions.setActId({id:baseInfo.id,_id:baseInfo._id}))
        dispatch(authActions.loginSuccess({ token: token, role: role, name: name }));
        navigate(`/dashboard/${baseInfo.baseId}`);
      }
    } catch (error) {
      let err = [];
      if (error.code === "ERR_NETWORK") {
        notify("Bad gateway");
      }
      if (error?.response?.status === 500) {
        notify("Something went wrong");
        return {
          ...currentState,
          email,
          errors: [],
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
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #ffffffff 0%, #0a0a0aff 100%)",
        padding: "20px",
      }}
    >
      <Toaster />
      <div
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5 text-center bg-white"
        style={{
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <div className="mb-4">
          <img
            src="https://res.cloudinary.com/demncxfgx/image/upload/v1760402383/shield_12843636_uawqza.png"
            alt="Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />
          <h2 className="fw-bold text-dark">MAMS</h2>
          {formState?.errors?.length > 0 && (
            <p className="text-danger small fw-semibold">
              {formState.errors[0]}
            </p>
          )}
        </div>

        <form action={formFn}>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              className="form-control rounded-3 shadow-sm"
              id="floatingInput"
              placeholder="name@example.com"
              defaultValue={formState?.email}
              required
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              name="password"
              className="form-control rounded-3 shadow-sm"
              id="floatingPassword"
              placeholder="Password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-dark w-100 fw-semibold py-2 rounded-3 shadow-sm"
            style={{
              background: "linear-gradient(90deg, #ecececff, #1a1717ff)",
              border: "none",
            }}
          >
            {isPending ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

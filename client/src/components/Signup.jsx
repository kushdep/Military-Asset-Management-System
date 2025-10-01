import "bootstrap/dist/css/bootstrap.min.css";
import { useActionState } from "react";
import { Link } from "react-router-dom";

const Signup = ({ authStateFn }) => {
  const [formStt, formFn, isPending] = useActionState({}, action);
  function action() {}

  async function action() {}

  return (
    <div
      className="card p-4 border-0"
      style={{ maxWidth: "400px", width: "100%" }}
    >
      <h3 className="text-center fw-bold mb-3">Create an Account</h3>
      <p className="text-center text-muted mb-4">
        Sign up to start shopping with{" "}
        <span className="fw-semibold">MyShop</span>
      </p>

      <form action={formFn}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control rounded-3"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="form-control rounded-3"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control rounded-3"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-warning text-dark fw-semibold rounded-3"
          >
            {isPending ? "Registring ..." : "Sign Up"}
          </button>
        </div>
      </form>

      <p className="text-center mt-3 mb-0">
        Already have an account?{" "}
        <Link
          onClick={() => authStateFn(true)}
          className="text-decoration-none fw-semibold text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;

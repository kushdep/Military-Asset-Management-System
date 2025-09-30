import { useActionState } from "react";
import Signup from "../components/Signup";
import { createPortal } from "react-dom";


function AuthModal({ reference, authStt, authSttFn }) {
    const [formState,formFn,isPending] = useActionState(action,{
        email:null
    })

    function action(){

    }

  return createPortal(
    <>
      <dialog
        ref={reference}
        className="rounded-4 shadow-lg border-0"
        style={{
          width: 420,
          maxWidth: "95%",
          padding: "0",
          background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <form method="dialog" className="p-0 m-0">
          <button
            type="submit"
            className="btn-close position-absolute top-0 end-0 m-3"
            aria-label="Close"
          ></button>
        </form>

        <div className="container px-4 py-5">
          <div className="row row-cols-1 text-center">
            {authStt ? (
              <form action={formFn}>
                <div className="col mb-4">
                  <h2 className="fw-bold text-dark">Welcome Back 👋</h2>
                  <p className="text-muted small">
                    Please log in to continue to your account
                  </p>
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

                <div className="d-flex align-items-center my-3">
                  <hr className="flex-grow-1" />
                  <span className="px-2 text-muted small">OR</span>
                  <hr className="flex-grow-1" />
                </div>

                <div className="col">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none text-primary"
                    disabled={isPending}
                    onClick={() => authSttFn(false)}
                  >
                    New user? Create an account
                  </button>
                </div>
              </form>
            ) : (
              <Signup  authStateFn = {authSttFn}/>
            )}
          </div>
        </div>
      </dialog>
    </>,
    document.getElementById("modal-root")
  );
}

export default AuthModal;

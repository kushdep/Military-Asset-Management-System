import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const { token } = useSelector((state) => state.authData);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <>
      <div className="container">
        <div className="row d-flex flex-column align-items-center">
          <img src="/public/Error.jpg" className="w-50 h-50" />
          {token!==null && (
            <button className="btn btn-danger w-25 fw-bold"
            onClick={()=>{
                navigate('/login')
                dispatch(authActions.logout())
            }}
            >LogOut</button>
          )}
        </div>
      </div>
    </>
  );
}

export default ErrorPage;

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { clearAuthError, resetPassword } from "../../actions/userActions";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function NewPassword() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();

  const redirect = location.search ? "/" + location.search.split("=")[1] : "/";
  const { isAuthenticated, error } = useSelector((state) => state.authState);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      dispatch(resetPassword(formData, token));
    } else {
      toast.error("password & confirm is not match", 1);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [error, isAuthenticated, dispatch, navigate]);
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={onSubmitHandler} className="shadow-lg">
          <h1 className="mb-3">New Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            id="new_password_button"
            type="submit"
            className="btn btn-block py-3"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  changepassword,
  clearAuthError,
  clearIsUpdate,
} from "../../actions/userActions";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [password, setPassword] = useState({
    oldPassword: "",
    password: "",
  });
  const { error, isUpdated } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useDispatch();

  const onChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("oldPassword", password.oldPassword);
    formData.append("password", password.password);
    dispatch(changePassword(formData));
  };

  useEffect(() => {
    if (isUpdated) {
      toast("Password Changed Successfully", {
        type: "success",
        position: "bottom-center",
        onOpen: () => {
          dispatch(clearIsUpdate);
        },
      });
      setPassword({
        oldPassword: "",
        password: "",
      });
      return;
    }

    if (error) {
      toast(error, {
        type: "error",
        position: "bottom-center",
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [error, isUpdated, dispatch]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={onSubmitHandler} className="shadow-lg">
          <h1 className="mt-2 mb-5">Update Password</h1>
          <div className="form-group">
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              id="old_password_field"
              className="form-control"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password_field">New Password</label>
            <input
              type="password"
              name="password"
              id="new_password_field"
              className="form-control"
              onChange={onChange}
            />
          </div>

          <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

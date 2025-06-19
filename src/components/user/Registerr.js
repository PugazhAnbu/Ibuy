import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register } from "../../actions/userActions";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/avatar.png");

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.authState
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    //form la vangana data ellam serdhu onna anuppa FormData (idhu js object Class) use panrom
    // In JavaScript, new FormData() is used to create a new FormData object.
    // This object is primarily used to easily collect and manage form data, especially when submitting form data via AJAX (using XMLHttpRequest or fetch) without needing to reload the page.

    // What does FormData do?
    // It represents a set of key/value pairs representing form fields and their values.
    // It can be used to serialize form data and append it to a request body when submitting data via a network request (e.g., via XMLHttpRequest or fetch).
    // FormData can handle various types of data (like files, text inputs, etc.).

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("avatar", avatar);

    dispatch(register(formData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        //epo readyState 2 nu varutho apo file read panni mudinchu meaning
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };
      //readAsDataURL vanthu oru data va URL convert pannum,  apdi convert pannadhu aprm oru event call seium, antha event ku oru listener vachu irupom adhu tan onload
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      return;
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
        <form
          onSubmit={onSubmitHandler}
          className="shadow-lg"
          encType="multipart/form-data"
        >
          <h1 className="mb-3">Register</h1>

          <div className="form-group">
            <label htmlFor="email_field">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar_upload">Avatar</label>
            <div className="d-flex align-items-center">
              <div>
                <figure className="avatar mr-3 item-rtl">
                  <img
                    src={avatarPreview}
                    className="rounded-circle"
                    alt="Avatar"
                  />
                </figure>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  name="avatar"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChange}
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Avatar
                </label>
              </div>
            </div>
          </div>

          <button
            id="register_button"
            type="submit"
            className="btn btn-block py-3"
            disabled={loading}
          >
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}

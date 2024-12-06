import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  clearIsUpdate,
  updateProfile,
} from "../../actions/userActions";
import { toast } from "react-toastify";

export default function UpdateProfile() {
  const { error, user, isUpdated } = useSelector((state) => state.authState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/avatar.png");
  const dispatch = useDispatch();

  const onChangeAvatar = (e) => {
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
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
    if (isUpdated) {
      toast("Profile Updated Successfully", {
        type: "success",
        position: "bottom-center",
        onOpen: () => {
          dispatch(clearIsUpdate);
        },
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
  }, [user, isUpdated, error, dispatch]);
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          onSubmit={submitHandler}
          className="shadow-lg"
          encType="multipart/form-data"
        >
          <h1 className="mt-2 mb-5">Update Profile</h1>

          <div className="form-group">
            <label htmlFor="email_field">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar_upload">Avatar</label>
            <div className="d-flex align-items-center">
              <div>
                <figure className="avatar mr-3 item-rtl">
                  <img
                    src={avatarPreview ?? "./images/profile.jpg"}
                    className="rounded-circle"
                    alt="Avatar Preview"
                  />
                </figure>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  name="avatar"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChangeAvatar}
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Avatar
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

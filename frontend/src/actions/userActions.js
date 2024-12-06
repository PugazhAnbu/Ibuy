import axios from "axios";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutRequest,
  logoutSuccess,
  logoutFail,
  changePasswordSuccess,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  changePasswordRequest,
  changePasswordFail,
  clearIsUpdateValue,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
} from "../slices/authSlice";

//intha login fun oru dipatch fun potu tan anupovom athanala inga dispatch kedaichudum
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`/api/v1/login`, { email, password });
    dispatch(loginSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(loginFail(error.response.data.message));
  }
};

export const clearAuthError = (dispatch) => {
  dispatch(clearError());
};
export const clearIsUpdate = (dispatch) => {
  dispatch(clearIsUpdateValue());
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(`/api/v1/register`, userData, config);
    dispatch(registerSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(registerFail(error.response.data.message));
  }
};

export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get(`/api/v1/myprofile`);
    dispatch(loadUserSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(loadUserFail(error.response.data.message));
  }
};

export const logoutUser = async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/v1/logout`);
    dispatch(logoutSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(logoutFail(error.response.data.message));
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    const { data } = await axios.put(`/api/v1/update`, userData, config);
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(updateProfileFail(error.response.data.message));
  }
};

export const changePassword = (formData) => async (dispatch) => {
  try {
    dispatch(changePasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(`/api/v1/password/change`, formData, config);
    dispatch(changePasswordSuccess());
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(changePasswordFail(error.response.data.message));
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/forgot`,
      formData,
      config
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(forgotPasswordFail(error.response.data.message));
  }
};

export const resetPassword = (formData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/reset/${token}`,
      formData,
      config
    );
    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    console.log(error, "error in login fail");
    //handle error
    dispatch(resetPasswordFail(error.response.data.message));
  }
};

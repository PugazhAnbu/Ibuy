import axios from "axios";
import {
  productFail,
  productRequest,
  productSuccess,
} from "../slices/productSlice";

export const getProduct = (id) => async (dispatch) => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  console.log("BASE_URL============>", BASE_URL);
  try {
    dispatch(productRequest());
    const { data } = await axios.get(`${BASE_URL}/api/v1/product/${id}`);
    dispatch(productSuccess(data));
  } catch (error) {
    //handle error
    dispatch(productFail(error.response.data.message));
  }
};

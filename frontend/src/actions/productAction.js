import axios from "axios";
import {
  productFail,
  productRequest,
  productSuccess,
} from "../slices/productSlice";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(`${BASE_URL}/api/v1/product/${id}`);
    dispatch(productSuccess(data));
  } catch (error) {
    //handle error
    dispatch(productFail(error.response.data.message));
  }
};

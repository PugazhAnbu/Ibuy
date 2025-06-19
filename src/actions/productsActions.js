import axios from "axios";
import {
  productsFail,
  productsRequest,
  productsSuccess,
} from "../slices/productsSlice";

export const getProducts =
  (keyword, price, category, rating, currentPage) => async (dispatch) => {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL;
    console.log("BASE_URL============>", BASE_URL);
    try {
      dispatch(productsRequest());
      let link = `${BASE_URL}/api/v1/products?page=${currentPage}`;
      if (keyword) {
        link += `&keyword=${keyword}`;
      }
      if (price) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }
      if (category) {
        link += `&category=${category}`;
      }
      if (rating) {
        link += `&ratings=${rating}`;
      }
      const { data } = await axios.get(link);
      dispatch(productsSuccess(data));
    } catch (error) {
      //handle error
      dispatch(productsFail(error.response?.data.message));
    }
  };

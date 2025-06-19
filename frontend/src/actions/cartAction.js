import axios from "axios";
import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const addCartItem = (id, quantity) => async (dispatch) => {
  try {
    dispatch(addCartItemRequest());
    const { data } = await axios.get(`${BASE_URL}/api/v1/product/${id}`);
    dispatch(
      addCartItemSuccess({
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].image,
        stock: data.product.stock,
        quantity,
      })
    );
  } catch (error) {}
};

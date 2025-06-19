import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
//ella reducer onna agardhu combineReducers
const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState: cartReducer,
  orderState: orderReducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  //   middleware: [thunk],
});

//namma action onnu anupuvom in redux state management la , antha action synchronous tan vela seiyum. i.e means time kattu pattu tan adhu vela seium.
//apdi kattu pattu vela seiyama irukka namma middleware use panna porom. adhu tan redux-thunk middleware.

export default store;

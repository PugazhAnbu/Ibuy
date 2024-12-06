import {
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "./Shipping";
import { toast } from "react-toastify";
import axios from "axios";
import { orderCompleted } from "../../slices/cartSlice";

export default function Payment() {
  const stripe = useStripe();

  //front end la payments la neraya element use pannumvom like card, upi , internet banking
  const elements = useElements();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { user } = useSelector((state) => state.authState);
  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );
  const paymentData = {
    amount: Math.round(orderInfo?.totalPrice * 100),
    shipping: {
      name: user.name,
      address: {
        city: shippingInfo.city,
        postal_code: shippingInfo.postal_code,
        country: shippingInfo.country,
        state: shippingInfo.state,
        line1: shippingInfo.address,
      },
      phone: shippingInfo.phoneNo,
    },
  };

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  useEffect(() => {
    validateShipping(shippingInfo, navigate);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;
    try {
      const { data } = await axios.post(`/api/v1/payment/process`, paymentData);
      const clientSecret = data.client_secret;
      //useStripe vangi vachomla stripe module la irundhu adhavachu oru method access panni payment panna poram

      //intha confirmCard payment method la 1st  parameter clientSecret kudukanum, aprm sila options kudukalam
      const result = stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message, {
          position: "bottom-center",
        });
        document.querySelector("#pay_btn").disabled = false;
      } else {
        if ((await result).paymentIntent.status === "succeeded") {
          toast.success(`Payment Success!`, {
            position: "bottom-center",
          });
          dispatch(orderCompleted());
          navigate("/order/success");
        } else {
          toast(`Please Try again`, {
            type: "warning",
            position: "bottom-center",
          });
        }
      }
    } catch (error) {}
  };
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-4">Card Info</h1>
          <div className="form-group">
            <label htmlFor="card_num_field">Card Number</label>
            <CardNumberElement
              type="text"
              id="card_num_field"
              className="form-control"
              value=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="card_exp_field">Card Expiry</label>
            <CardExpiryElement
              type="text"
              id="card_exp_field"
              className="form-control"
              value=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="card_cvc_field">Card CVC</label>
            <CardCvcElement
              type="text"
              id="card_cvc_field"
              className="form-control"
              value=""
            />
          </div>

          <button id="pay_btn" type="submit" className="btn btn-block py-3">
            Pay {`$${orderInfo && orderInfo.totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}

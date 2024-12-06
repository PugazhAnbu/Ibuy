import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { useSelector, useDispatch } from "react-redux";
import { DropdownButton, Dropdown, Image } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import { clearAuthError, logoutUser } from "../../actions/userActions";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Header() {
  const { isAuthenticated, user, error } = useSelector(
    (state) => state.authState
  );
  const { items: cartItems } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser);
  };

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to={"/"}>
            <img width="150px" src="/images/logo.png" alt="Ibuy Logo" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated ? (
          <>
            <Dropdown className="d-inline">
              <Dropdown.Toggle
                id="dropdown-basic"
                variant="default text-white pr-5"
              >
                <figure className="avatar avatar-nav">
                  <Image
                    width={"50px"}
                    src={user.avatar ?? "./images/avatar.png"}
                  />
                </figure>
                <span>{user.name}</span>
              </Dropdown.Toggle>
              <DropdownMenu>
                <Dropdown.Item
                  className="text-dark"
                  onClick={() => navigate("/myprofile")}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </DropdownMenu>
            </Dropdown>
            <Link to={"/cart"}>
              <span id="cart" className="ml-3">
                Cart
              </span>
            </Link>
            <span className="ml-1" id="cart_count">
              {cartItems.length}
            </span>
          </>
        ) : (
          <Link to="/login" className="btn" id="login_btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

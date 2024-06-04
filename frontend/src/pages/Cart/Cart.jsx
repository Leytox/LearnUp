import { useContext, useEffect, useState } from "react";
import UserContext from "../../UserContext.jsx";
import { Link, Navigate } from "react-router-dom";
import "./Cart.css";
import Cookies from "js-cookie";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!Cookies.get("token")) {
          setRedirect(true);
          return;
        }
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);
  console.log(cart);
  if (redirect) return <Navigate to={"/login"} />;

  return (
    <div className="cart-container">
      <Helmet>
        <title>Cart</title>
      </Helmet>
      {cart.length === 0 ? (
        <>
          <h1 className={"cart-empty"}>Your cart is empty...</h1>
          <Link to={"/courses"}>
            <button>Buy courses</button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="cart-title">Cart</h1>
          <h1>Some courses lol</h1>
        </>
      )}
    </div>
  );
}

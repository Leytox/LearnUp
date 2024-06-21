import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import Cookies from "js-cookie";
import axios from "axios";
import { Helmet } from "react-helmet";
import Preloader from "../../components/Preloader/Preloader.jsx";
import {
  faCartShopping,
  faCreditCard,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!Cookies.get("token")) {
          setRedirect(true);
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/cart`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setCart(response.data);
        const total = response.data.reduce(
          (sum, cartItem) => sum + cartItem.course.price,
          0,
        );
        setTotal(total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile().finally(() => setLoading(false));
  }, [total]);

  const removeFromCart = async (courseId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/cart/remove`,
        { courseId },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      // After successfully removing the course from the cart, update the cart state
      const newCart = cart.filter(
        (cartItem) => cartItem.course._id !== courseId,
      );
      setCart(newCart);
      // Recalculate the total price of all courses in the cart
      const newTotal = newCart.reduce(
        (sum, cartItem) => sum + cartItem.course.price,
        0,
      );
      setTotal(newTotal);
    } catch (error) {
      console.error(error);
    }
  };

  const checkout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/payments/process`,
        {},
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) navigate("/login");

  return loading ? (
    <Preloader />
  ) : (
    <div className="cart-container main-wrapper">
      <Helmet>
        <title>{t("cart")}</title>
      </Helmet>
      {cart.length === 0 ? (
        <>
          <h1 className={"cart-empty"}>{t("emptyCart")}</h1>
          <Link to={"/courses?search="}>
            <button>
              {t("buyCourses")}
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </Link>
        </>
      ) : (
        <>
          <div className={"cart-box"}>
            <div className={"cart-items"}>
              {cart.map((cartItem, index) => (
                <div key={index} className={"cart-item"}>
                  <CourseCard course={cartItem.course}>
                    <button
                      onClick={() => removeFromCart(cartItem.course._id)}
                      className={"cart-button-remove-item"}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </CourseCard>
                </div>
              ))}
            </div>
            <div className={"cart-info"}>
              <h1>
                {t("total")}: ${total}
              </h1>
              <button className={"cart-button-checkout"} onClick={checkout}>
                {t("checkout")} <FontAwesomeIcon icon={faCreditCard} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

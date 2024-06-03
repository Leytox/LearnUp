import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./CookieConsent.css";

export default function CookieConsent() {
  const [show, setShow] = useState(Cookies.get("cookieConsent") !== "true");

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true");
    setShow(false);
  };

  useEffect(() => {
    if (Cookies.get("cookieConsent")) setShow(false);
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="overlay"></div>
      <div className="cookie-consent">
        <p>
          We use cookies to improve your experience. By using our site, you
          agree to our use of cookies.
        </p>
        <button onClick={handleAccept}>Accept</button>
        <a href={"https://en.wikipedia.org/wiki/HTTP_cookie"} target={"_blank"}>
          <button id={"about"}>About cookies</button>
        </a>
      </div>
    </>
  );
}

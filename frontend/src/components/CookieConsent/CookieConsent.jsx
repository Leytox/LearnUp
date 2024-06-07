import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./CookieConsent.css";

export default function CookieConsent() {
  const [show, setShow] = useState(Cookies.get("cookieConsent") !== "true");

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
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
        <h2>This website uses cookies</h2>
        <p>
          We use cookies to personalise content and ads, to provide social media
          features and to analyse our traffic. We also share information about
          your use of our site with our social media, advertising and analytics
          partners who may combine it with other information that you’ve
          provided to them or that they’ve collected from your use of their
          services.
        </p>
        <button onClick={handleAccept}>Accept</button>
        <a href={"https://en.wikipedia.org/wiki/HTTP_cookie"} target={"_blank"}>
          <button id={"about"}>About cookies</button>
        </a>
      </div>
    </>
  );
}

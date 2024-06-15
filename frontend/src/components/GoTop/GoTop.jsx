import { useEffect, useState } from "react";
import "./GoTop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"; // Assuming you have a CSS file for styling

export default function GoTop() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    if (window.scrollY > 500) setIsVisible(true);
    else setIsVisible(false);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <div className={"scroll-to-top"} onClick={scrollToTop}>
        <FontAwesomeIcon icon={faArrowUp} />
      </div>
    )
  );
}

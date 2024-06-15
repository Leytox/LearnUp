import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./ThemeSwitcher.css";

export default function ThemeSwitcher() {
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <button
      className={`theme-switcher-button ${dark ? "dark" : "light"}`}
      onClick={toggle}
    >
      {dark ? (
        <FontAwesomeIcon icon={faLightbulb} />
      ) : (
        <FontAwesomeIcon icon={faMoon} />
      )}
    </button>
  );
}

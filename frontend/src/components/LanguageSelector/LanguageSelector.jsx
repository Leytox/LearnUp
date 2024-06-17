import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import "./LanguageSelector.css";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

function LanguageSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    if (Cookies.get("language")) handleLanguageChange(Cookies.get("language"));
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang).then(() => {
      setLanguage(lang);
      setShowDropdown(false);
      Cookies.set("language", lang, { expires: 365, sameSite: "strict" });
    });
  };

  return (
    <div className="language-selector">
      <button
        onClick={handleToggleDropdown}
        className="dropdown-button"
        title={"Change language"}
      >
        <FontAwesomeIcon icon={faGlobe} />
      </button>
      {showDropdown && (
        <ul className="dropdown-menu">
          <li
            className={language === "en" && "selected-language"}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </li>
          <li
            className={language === "ua" && "selected-language"}
            onClick={() => handleLanguageChange("ua")}
          >
            Українська
          </li>
          <li
            className={language === "es" && "selected-language"}
            onClick={() => handleLanguageChange("es")}
          >
            Español
          </li>
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;

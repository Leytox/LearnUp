import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import "./LanguageSelector.css"; // Import the CSS file for styling

function LanguageSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowDropdown(false);
    // Handle language change logic here
    console.log("Language selected:", lang);
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
          <li onClick={() => handleLanguageChange("en")}>English</li>
          <li onClick={() => handleLanguageChange("ua")}>Ukrainian</li>
          <li onClick={() => handleLanguageChange("es")}>Spanish</li>
          {/* Add more languages as needed */}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;

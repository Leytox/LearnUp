import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DeviceContext } from "../../DeviceContext.jsx";
import "./Search.css";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isSearchVisible, setIsSearchVisible } = useContext(DeviceContext);
  const { isMobile } = useContext(DeviceContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleMobileSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const trimmedSearchTerm = searchTerm.trim();

  return (
    <div className={"search"}>
      {isMobile ? (
        // Mobile search component
        <>
          {isSearchVisible ? (
            <input
              type="text"
              placeholder="Search for courses..."
              id={"search"}
              value={searchTerm}
              onChange={handleInputChange}
            />
          ) : null}
          {trimmedSearchTerm && (
            <button id={"clear-search-text"} onClick={() => setSearchTerm("")}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
          <button
            id={isSearchVisible ? "search-expanded" : ""}
            onClick={() => {
              if (trimmedSearchTerm)
                navigate(`/courses?search=${trimmedSearchTerm}`);
              else toggleMobileSearch();
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </>
      ) : (
        // Default search component
        <>
          <input
            type="text"
            placeholder="Search for courses..."
            id={"search"}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {trimmedSearchTerm ? (
            <div>
              <button
                id={"clear-search-text"}
                onClick={() => setSearchTerm("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <Link to={`/courses?search=${trimmedSearchTerm}`}>
                <button>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                if (trimmedSearchTerm)
                  navigate(`/courses?search=${trimmedSearchTerm}`);
                else toggleMobileSearch();
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

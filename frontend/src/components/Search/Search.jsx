import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const trimmedSearchTerm = searchTerm.trim();

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search for courses..."
        id={"search"}
        value={searchTerm}
        onChange={handleInputChange}
      />
      {trimmedSearchTerm ? (
        <Link to={`/courses?search=${trimmedSearchTerm}`}>
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </Link>
      ) : (
        <Link to={"/courses?search="}>
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </Link>
      )}
    </div>
  );
}

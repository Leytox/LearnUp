import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Search.css";

export default function Search() {
  return (
    <div className="search">
      <input type="text" placeholder="Search for courses..." id={"search"} />
      <button>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}

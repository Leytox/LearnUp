import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  return (
    <div className="search">
      <input type="text" placeholder="Search for anything..." id={"search"} />
      <button>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}

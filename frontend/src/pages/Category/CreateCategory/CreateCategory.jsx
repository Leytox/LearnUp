import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Preloader from "../../../components/Preloader/Preloader.jsx";

export default function CreateCategory() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("role");
    if (!role || role !== "admin") setRedirect(true);
    setLoading(false);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file[0]);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/categories",
        formData,
        { headers: { "x-auth-token": Cookies.get("token") } },
      );
      if (response.status === 200) alert("Category created");
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) navigate("/admin");

  return loading ? (
    <Preloader />
  ) : (
    <div>
      <h1 style={{ textAlign: "center" }}>Create Category</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"name"}>Name</label>
        <input
          type={"text"}
          id={"name"}
          required={true}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor={"picture"}>Picture</label>
        <input
          required={true}
          type="file"
          onChange={(e) => setFile(e.target.files)}
        />
        <button type={"submit"}>Create</button>
      </form>
    </div>
  );
}

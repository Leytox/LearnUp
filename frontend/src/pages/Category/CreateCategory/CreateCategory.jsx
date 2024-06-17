import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

export default function CreateCategory() {
  const { t } = useTranslation(); // Initialize useTranslation
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
        `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
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
    <div className={"main-wrapper"}>
      <Helmet>
        <title>{t("createCategory")}</title>
      </Helmet>
      <h1 style={{ textAlign: "center" }}>{t("createCategory")}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"name"}>{t("name")}</label>
        <input
          maxLength={12}
          type={"text"}
          id={"name"}
          required={true}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor={"picture"}>{t("picture")}</label>
        <input
          required={true}
          type="file"
          onChange={(e) => setFile(e.target.files)}
        />
        <button type={"submit"}>
          {t("createCategoryButton")} <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
    </div>
  );
}

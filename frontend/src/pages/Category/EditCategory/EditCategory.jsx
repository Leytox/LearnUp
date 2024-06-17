import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import NotFound from "../../NotFound/NotFound.jsx";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

export default function EditCategory() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(null);
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("role");
    if (!role || role !== "admin") setRedirect(true);
    else {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/categories/${id}`,
            { headers: { "x-auth-token": Cookies.get("token") } },
          );
          setName(response.data.name);
          setCategory(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData().finally(() => setLoading(false));
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("file", file[0]);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/categories/${id}`,
        formData,
        { headers: { "x-auth-token": Cookies.get("token") } },
      );
      if (response.status === 200) alert("Category edited");
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) navigate("/admin");

  return loading ? (
    <Preloader />
  ) : category ? (
    <div className={"main-wrapper"}>
      <Helmet>
        <title>{t("editCategory")}</title>
      </Helmet>
      <h1 style={{ textAlign: "center" }}>{t("editCategory")}</h1>
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
          {t("editCategoryButton")} <FontAwesomeIcon icon={faPen} />
        </button>
      </form>
    </div>
  ) : (
    <NotFound />
  );
}

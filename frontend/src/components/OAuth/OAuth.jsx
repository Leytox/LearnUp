import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Cookies from "js-cookie";
import UserContext from "../../UserContext.jsx";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const { t } = useTranslation();
  const { setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const handleOAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/google-oauth`,
        {
          username: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }
      );
      console.log(response);
      if (response.status === 200) setRedirect(true);
      if (response.data.token)
        Cookies.set("token", response.data.token, {
          expires: 1,
          sameSite: "strict",
        });
      if (response.data.id)
        Cookies.set("id", response.data.id, {
          expires: 1,
          sameSite: "strict",
        });
      if (response.data.username) {
        Cookies.set("username", response.data.username, {
          expires: 1,
          sameSite: "strict",
        });
        setUser({ username: response.data.username });
      }
      if (response.data.role)
        Cookies.set("role", response.data.role, {
          expires: 1,
          sameSite: "strict",
        });
    } catch (error) {
      console.error(error);
    }
  };
  if (redirect) navigate("/");
  return (
    <button className="oauth" type="button" onClick={handleOAuth}>
      {t("continueWithGoogle")} <FontAwesomeIcon icon={faGoogle} />
    </button>
  );
}

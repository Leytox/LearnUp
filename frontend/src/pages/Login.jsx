import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "../UserContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (Cookies.get("token")) setRedirect(true);
  }, []);

  async function Login(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );
      if (response.status === 200) setRedirect(true);
      if (response.data.token) Cookies.set("token", response.data.token);
      if (response.data.username) {
        Cookies.set("username", response.data.username);
        setUser({ username: response.data.username });
      }
    } catch (err) {
      setError(true);
    }
  }

  if (redirect) return <Navigate to={"/"} />;
  return (
    <form onSubmit={Login}>
      <h1>Login</h1>
      <input
        type="email"
        id="email"
        name="email"
        placeholder={"Email"}
        required={true}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder={"Password"}
        required={true}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type={"submit"}>Login</button>
      {error && <p style={{ color: "red" }}>Invalid email or password</p>}
    </form>
  );
}

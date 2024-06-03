import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [bio, setBio] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) setRedirect(true);
  }, []);

  async function Register(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role,
          bio,
        },
      );
      if (response.status === 200) setRedirect(true);
      if (response.data.token) Cookies.set("token", response.data.token);
    } catch (err) {
      setError(true);
    }
  }

  if (redirect) return <Navigate to={"/login"} />;

  return (
    <form onSubmit={Register}>
      <h1>Sign up</h1>
      <input
        type="text"
        id="name"
        name="name"
        placeholder={"Name"}
        required={true}
        minLength={3}
        onChange={(event) => setName(event.target.value)}
      />
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
        minLength={6}
        onChange={(event) => setPassword(event.target.value)}
      />
      <select
        id="role"
        name="role"
        required={true}
        onChange={(event) => setRole(event.target.value)}
      >
        <option value={"student"}>Student</option>
        <option value={"instructor"}>Instructor</option>
      </select>
      <textarea
        id="bio"
        name="bio"
        placeholder={"Tell something about yourself..."}
        rows="4"
        cols="50"
        onChange={(event) => setBio(event.target.value)}
      />
      <button type={"submit"}>Sign up</button>
      {error && <p style={{ color: "red" }}>User already exists</p>}
    </form>
  );
}

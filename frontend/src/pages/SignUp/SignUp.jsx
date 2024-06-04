import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

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
    } catch (err) {
      setError(true);
    }
  }

  if (redirect) return <Navigate to={"/login"} />;

  return (
    <form onSubmit={Register}>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1>Create an account</h1>
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
        rows="2"
        cols="50"
        onChange={(event) => setBio(event.target.value)}
      />
      <button type={"submit"}>Continue</button>
      <p>
        Already have an account?{" "}
        <Link to={"/login"} style={{ color: "#007bff" }}>
          Log in
        </Link>
      </p>
      {error && <p style={{ color: "red" }}>User already exists</p>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <hr></hr>
        <h3>OR</h3>
        <hr></hr>
      </div>
      <div
        style={{
          display: "flex",
          gap: "25px",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <button>
          <a
            href="http://localhost:5000/api/auth/google"
            className={"oauth-button"}
          >
            <FontAwesomeIcon icon={faGoogle} /> Continue with Google
          </a>
        </button>
        <button>
          <a href="http://localhost:5000/api/auth/facebook">
            <FontAwesomeIcon icon={faFacebook} /> Continue with Facebook
          </a>
        </button>
        <button>
          <a href="http://localhost:5000/api/auth/twitter">
            <FontAwesomeIcon icon={faTwitter} /> Continue with Twitter
          </a>
        </button>
      </div>
    </form>
  );
}

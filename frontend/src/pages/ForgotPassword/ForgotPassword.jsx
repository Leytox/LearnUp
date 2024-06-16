import { Helmet } from "react-helmet";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/forgot-password`, {
      email,
    });
    alert("Email was sent");
  };
  return (
    <div className="main-wrapper">
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

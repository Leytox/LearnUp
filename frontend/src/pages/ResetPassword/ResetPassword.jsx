import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  async function ResetPassword(event) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/reset-password/${token}`,
        {
          newPassword,
        },
      );
      if (response.status === 200) setSuccess("Password reset successful");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  }

  return (
    <form onSubmit={ResetPassword} className={"main-wrapper"}>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <h1>Reset Password</h1>
      <input
        type="password"
        id="password"
        name="password"
        placeholder={"Password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder={"Confirm Password"}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
}

import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import "./Profile.css";
import UserContext from "../../../UserContext.jsx";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import {
  faArrowRightFromBracket,
  faFloppyDisk,
  faKey,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!Cookies.get("token")) {
          setRedirect(true);
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/profile/${Cookies.get("id")}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setProfile(response.data);
        setName(response.data.name);
        setBio(response.data.bio);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/profile/password`,
        { oldPassword, newPassword },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      if (response.status === 200) {
        alert("Password reset successful");
        setShowModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordError(null);
        setShowResetPassword(false);
      }
    } catch (error) {
      setPasswordError("Old password is incorrect");
    }
  };

  const uploadProfilePicture = async (event) => {
    const formData = new FormData();
    formData.append("profilePicture", event.target.files[0]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/profile/picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProfilePicture = async () => {
    if (
      !window.confirm("Are you sure you want to delete your profile picture?")
    )
      return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/profile/picture`,
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/profile/`,
        { name, bio },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setProfile(response.data);
      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) return <Navigate to={"/login"} />;
  const fileInputStyle = {
    display: "none",
  };

  const labelStyle = {
    position: "absolute",
    top: "75%", // adjust as needed
    left: "75%", // adjust as needed
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    lineHeight: "10px",
    textAlign: "center",
    fontSize: "20px",
  };
  return loading ? (
    <Preloader />
  ) : (
    <div className="profile-container main-wrapper">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <h1>Profile</h1>
      {profile && (
        <div className={"profile"}>
          <div className={"profile-info"}>
            <div style={{ position: "relative" }}>
              <img
                className={"profile-picture"}
                src={
                  profile.profilePicture
                    ? `${import.meta.env.VITE_BACKEND_URI}/${profile.profilePicture}`
                    : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                }
                alt={"profile picture"}
              />
              {editMode ? (
                <>
                  <input
                    style={fileInputStyle}
                    id="fileInput"
                    type="file"
                    onChange={uploadProfilePicture}
                  />
                  <label style={labelStyle} htmlFor="fileInput">
                    +
                  </label>
                </>
              ) : (
                <></>
              )}
            </div>
            {editMode ? (
              <>
                <div style={{ display: "flex", gap: "25px" }}>
                  <button
                    onClick={deleteProfilePicture}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete Avatar <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <label>
                  <strong>Name</strong>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label>
                  <strong>Bio</strong>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <button
                  onClick={handleEdit}
                  style={{ backgroundColor: "darkgreen" }}
                >
                  Save <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </p>
                <p>
                  <strong>With us since:</strong> :{" "}
                  {new Date(profile.createdAt).getFullYear()} year
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio}
                </p>
              </>
            )}
          </div>
          <div className={"profile-settings"}>
            <h2 style={{ textAlign: "center" }}>Settings</h2>
            <div className={"profile-settings-buttons"}>
              <h3>Logout from your account </h3>
              <p>This will log you out and redirect you to the homepage.</p>
              <button
                onClick={() => {
                  if (!window.confirm("Are you sure you want to logout?"))
                    return;
                  Cookies.remove("token");
                  Cookies.remove("username");
                  Cookies.remove("role");
                  Cookies.remove("id");
                  setUser(null);
                  navigate("/");
                }}
              >
                Logout <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </button>
            </div>
            <div className={"profile-settings-buttons"}>
              <h3>Edit Profile Data</h3>
              <p>This will allow you to update your profile information.</p>
              <button
                className={"edit-profile-button"}
                onClick={() => {
                  setEditMode((prev) => !prev);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Edit Profile <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
            <div className={"profile-settings-buttons"}>
              <h3>Reset Password</h3>
              <p>Reset your account password</p>
              <button onClick={toggleModal} className={"reset-password-button"}>
                Reset Password <FontAwesomeIcon icon={faKey} />
              </button>
            </div>
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={toggleModal}>
                    &times;
                  </span>
                  <h1>Reset Password</h1>
                  <form onSubmit={handlePasswordReset}>
                    <input
                      type="password"
                      placeholder="Old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <button type="submit">Reset Password</button>
                    {passwordError && <p>{passwordError}</p>}
                  </form>
                </div>
              </div>
            )}
            <div className={"profile-settings-buttons"}>
              <h3>Delete Account</h3>
              <p>
                This will permanently delete your account and all associated
                data.
              </p>
              <button
                className={"delete-account-button"}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone.",
                    )
                  ) {
                    axios
                      .delete(
                        `${import.meta.env.VITE_BACKEND_URI}/api/profile`,
                        {
                          headers: {
                            "x-auth-token": Cookies.get("token"),
                          },
                        },
                      )
                      .then(() => {
                        Cookies.remove("token");
                        Cookies.remove("username");
                        setUser(null);
                        navigate("/");
                      })
                      .catch((error) => console.error(error));
                  }
                }}
              >
                Delete <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

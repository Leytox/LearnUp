import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import "./Profile.css";
import UserContext from "../../../UserContext.jsx";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import {
  faPenToSquare,
  faRightFromBracket,
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
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        });
        setProfile(response.data);
        setName(response.data.name);
        setBio(response.data.bio);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const uploadProfilePicture = async (event) => {
    const formData = new FormData();
    formData.append("profilePicture", event.target.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/profile/picture",
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
        "http://localhost:5000/api/profile/picture",
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
        "http://localhost:5000/api/profile",
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
    <div className="profile-container">
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
                    ? `http://localhost:5000/${profile.profilePicture}`
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
                  Save
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
                Logout <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
            <div className={"profile-settings-buttons"}>
              <h3>Edit Profile Data</h3>
              <p>This will allow you to update your profile information.</p>
              <button
                style={{ backgroundColor: "#007bff" }}
                onClick={() => setEditMode((prev) => !prev)}
              >
                Edit Profile <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
            <div className={"profile-settings-buttons"}>
              <h3>Delete Account</h3>
              <p>
                This will permanently delete your account and all associated
                data.
              </p>
              <button
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone.",
                    )
                  ) {
                    axios
                      .delete("http://localhost:5000/api/profile", {
                        headers: {
                          "x-auth-token": Cookies.get("token"),
                        },
                      })
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

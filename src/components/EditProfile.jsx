import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const EditProfile = (props) => {
  const { profile } = props;
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [gender, setGender] = useState(profile.gender || "");
  const [age, setAge] = useState(profile.age || "");
  const [about, setAbout] = useState(profile.about || "");
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    try {
      const updatedProfile = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, gender, age, about, photoUrl },
        { withCredentials: true }
      );
      dispatch(addUser(updatedProfile?.data?.data));
      setError("");
      setSuccess("Profile updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setSuccess("");
      setError(
        error?.response?.data?.message ||
          "Error updating profile. Please try again."
      );
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex justify-center gap-10 my-10">
      <UserCard
        user={{ firstName, lastName, gender, age, about, photoUrl }}
        noButton={true}
      />
      <div className="flex justify-center">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>
            <div className="py-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Gender</span>
                </div>
                <input
                  type="text"
                  value={gender}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Age</span>
                </div>
                <input
                  type="text"
                  value={age}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Photo Url</span>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">About</span>
                </div>
                <textarea
                  value={about}
                  className="textarea textarea-bordered"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>
            </div>
            <p className="text-red-500">{error}</p>
            {showToast && (
              <div className="toast toast-center toast-top">
                <div className="alert alert-success">
                  <span>{success}</span>
                </div>
              </div>
            )}
            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={handleSave}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";

const UserCard = ({ user, refresh, noButton = false }) => {
  const [success, setSuccess] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      refresh();
      setSuccess(response?.data?.message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setSuccess("");
      console.error(error);
    }
  };

  const { _id, firstName, lastName, photoUrl, gender, age, about } = user;

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img className="text-center w-96 h-96" src={photoUrl} alt={firstName + " profile photo"} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>{(age && age) + (gender && ", " + gender)} </p>
        <p>{about}</p>
        {!noButton && (
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => handleSendRequest("ignore", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        )}
      </div>
      {showToast && (
        <div className="toast toast-center toast-top">
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;

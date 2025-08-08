import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestsSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState("");

  const handleAction = async (status, requestId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      getRequests();
    } catch (error) {
      console.error("Error handling request action:", error);
    }
  };

  const getRequests = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(response.data.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (!requests) return;

  if (requests?.length === 0) {
    return (
      <h1 className="flex justify-center my-5 font-bold"> No Connection Requests found. </h1>
    );
  }

  const users = requests?.map((request) => ({
    ...request.fromUserId,
    requestId: request._id,
  }));

  return (
    <div className="flex flex-col my-10">
      <h1 className="font-bold text-3xl mb-3 text-center">
        Connection Requests
      </h1>
      <div className="flex gap-5 flex-wrap justify-start">
        {users?.map((user) => (
          <div key={user._id} className="card bg-base-300 shadow-xl m-2">
            <div className="card-body" style={{ width: "300px", height: "450px", overflowY: "auto" }}>
              <img
                src={user?.photoUrl}
                alt={`${user.firstName}'s profile`}
                className="rounded-full w-56 h-56 mb-3"
              />
              <h2 className="card-title">
                {user.firstName} {user.lastName}
              </h2>
              <p>
                {(user?.age ? user.age : "") +
                  (user?.age && user?.gender ? ", " : "") +
                  (user?.gender ? user.gender : "")}
              </p>
              {user?.about && <p>{user.about}</p>}
            </div>
            <div className="card-actions justify-center my-4">
              <button
                className="btn btn-primary"
                onClick={() => handleAction("rejected", user.requestId)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleAction("accepted", user.requestId)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
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

export default Requests;

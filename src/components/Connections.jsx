import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const getConnections = async () => {
    try {
      const connectionsData = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(connectionsData?.data?.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections) return;

  if (connections?.length === 0)
    return (
      <h1 className="flex justify-center font-bold my-5">
        No Connections found.
      </h1>
    );

  return (
    <div className="flex flex-col my-10">
      <h1 className="font-bold text-3xl mb-3 text-center">Connections</h1>
      <div className="flex gap-5 flex-wrap justify-start">
        {connections?.map((connection) => (
          <div key={connection._id} className="card bg-base-300 shadow-xl m-2">
            <div
              className="card-body"
              style={{ width: "300px", height: "500px", overflowY: "auto" }}
            >
              <img
                src={connection?.photoUrl}
                alt={`${connection.firstName}'s profile`}
                className="rounded-full w-56 h-56 mb-3"
              />
              <h2 className="card-title">
                {connection.firstName} {connection.lastName}
              </h2>
              <p>
                {(connection?.age ? connection.age : "") +
                  (connection?.age && connection?.gender ? ", " : "") +
                  (connection?.gender ? connection.gender : "")}
              </p>
              {connection?.about && <p>{connection.about}</p>}
              <div className="card-actions justify-center mt-4">
                <Link to={`/chat/${connection?._id}`}>
                  <button className="btn btn-secondary">Chat</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;

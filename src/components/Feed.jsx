import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feed = useSelector((store) => store.feed);

  const getFeedData = async () => {
    try {
      const feedData = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(feedData.data.data));
    } catch (error) {
      console.error("Error fetching feed data:", error);
      if (error.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getFeedData();
  }, []);

  if (!feed?.length)
    return <h1 className="font-bold text-center my-5">No feed to display</h1>;

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} refresh={getFeedData} />
    </div>
  );
};

export default Feed;

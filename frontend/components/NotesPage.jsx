import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";

const NotesPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };


  if (!user) return null;

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={logout}>Logout</button>
      <p>📝 Your notes will show here</p>
    </div>
  );
};

export default NotesPage;

/*
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";

function UserData({ uid }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      setUserData(userDocSnapshot.data());
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUserData = debounce(fetchUserData, 500);

  useEffect(() => {
    debouncedFetchUserData();
  }, [debouncedFetchUserData]);

  return (
    <div>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <div>
          <h2>User Data</h2>
          <p>Name: {userData?.name}</p>
          <p>Email: {userData?.email}</p>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        setName(userData?.name);
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user data");
      } finally {
        setLoadingName(false);
      }
    };

    if (!user) {
      navigate("/");
      return;
    }

    fetchUserName();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
      alert("An error occurred while logging out");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as{" "}
        <div>{loadingName ? "Loading..." : name || user?.email}</div>

        {error && <div>Error fetching user data</div>}

        <button className="dashboard__btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <UserData uid={user?.uid} />
    </div>
  );
}

export default Dashboard;

*/
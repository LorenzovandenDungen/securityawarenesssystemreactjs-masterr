import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        <li>
          <Link to="/admin/add-post">Add Post</Link>
        </li>
        <li>
          <Link to="/admin/posts">Manage Posts</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;

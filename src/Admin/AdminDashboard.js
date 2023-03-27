import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import * as Papa from 'papaparse';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [inviteDuration, setInviteDuration] = useState(7);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection('users').onSnapshot(snapshot => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
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

  const handleFileUpload = e => {
    setSelectedUsers([]);
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: results => {
        const users = results.data.slice(1).map(row => ({
          name: row[0],
          email: row[1],
          role: row[2],
        }));
        db.collection('users').add({ users });
      },
    });
  };

  const handleInvite = () => {
    selectedUsers.forEach(user => {
      db.collection('invites').add({
        userId: user.id.id,
        trainingId: 'some-training-id',
        validUntil: new Date(Date.now() + inviteDuration * 86400000), // invite valid for inviteDuration days
      });
      // TODO: Send email invite to user
    });
  };

  const handleRoleChange = (userId, role) => {
    db.collection('users').doc(userId).update({ role });
  };

  const handleUserSubmit = e => {
    e.preventDefault();
    db.collection('users').add({
      name: userName,
      email: userEmail,
      role: userRole,
    });
    setUserName('');
    setUserEmail('');
    setUserRole('admin');
  };

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('admin');

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
              <td>
                <button onClick={() => setSelectedUsers([...selectedUsers, user])}>
                  Invite
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUsers.length > 0 && (
        <div>
          <h2>Invite Users</h2>
          <p>Invite valid for {inviteDuration} days</p>
          <button onClick={handleInvite}>Send Invites</button>
        </div>
      )}
      <h2>Add User</h2>
      <form onSubmit={handleUserSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Role:
          <select value={userRole} onChange={e => setUserRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
      <h2>Upload Users</h2>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};
export default AdminDashboard;
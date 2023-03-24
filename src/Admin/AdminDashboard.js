import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import * as Papa from 'papaparse';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [inviteDuration, setInviteDuration] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = firestore.collection('users').onSnapshot(snapshot => {
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
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: results => {
        const users = results.data.slice(1).map(row => ({
          name: row[0],
          email: row[1],
          role: row[2],
        }));
        firestore.collection('users').add({ users });
      },
    });
  };

  const handleInvite = () => {
    selectedUsers.forEach(user => {
      firestore.collection('invites').add({
        userId: user.id,
        trainingId: 'some-training-id',
        validUntil: new Date(Date.now() + inviteDuration * 86400000), // invite valid for inviteDuration days
      });
      // TODO: Send email invite to user
    });
  };

  const handleRoleChange = (userId, role) => {
    firestore.collection('users').doc(userId).update({ role });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>Users</h2>
      <p>Add user:</p>
      <form onSubmit={handleUserSubmit}>
        <label>
          Name:
          <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
        </label>
        <label>
          Role:
          <select value={userRole} onChange={e => setUserRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="company">Company</option>
          </select>
        </label>
        <button type="submit">Add user</button>
      </form>
      <p>Upload users from CSV:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <ul>
        {users.map(user => (
          <li key={user.id}>
<input
type="checkbox"
onChange={() =>
setSelectedUsers(selectedUsers.includes(user) ? selectedUsers.filter(u => u !== user) : [...selectedUsers, user])
}
/>
{user.name} ({user.email}) - {user.role}
{user.id !== currentUser.id && (
<select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}>
<option value="admin">Admin</option>
<option value="employee">Employee</option>
<option value="company">Company</option>
</select>
)}

</li>
))}
</ul>
<h2>Invitations</h2>
<p>Invite selected users to training:</p>
<label>
  Valid for (days):
  <input
    type="number"
    min="1"
    max="30"
    value={inviteDuration}
    onChange={e => setInviteDuration(e.target.value)}
  />
</label>
<button onClick={handleInvite} disabled={selectedUsers.length === 0}>
  Invite
</button>
<Link to="/">Go back</Link>
</div>
);
};
export default AdminDashboard;

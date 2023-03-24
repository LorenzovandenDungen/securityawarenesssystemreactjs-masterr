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
        userId: user.id,
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
      <p>Welcome {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>Users</h2>
      <div>
        <label htmlFor="file">Upload CSV file:</label>
        <input type="file" id="file" onChange={handleFileUpload} />
      </div>
      <h3>Add User</h3>
      <form onSubmit={handleUserSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={userName} onChange={e => setUserName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={userEmail} onChange={e => setUserEmail(e.target.value)
} />
</div>
<div>
<label htmlFor="role">Role:</label>
<select id="role" value={userRole} onChange={e => setUserRole(e.target.value)}>
<option value="admin">Admin</option>
<option value="user">User</option>
</select>
</div>
<button type="submit">Add User</button>
</form>
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
<select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}>
<option value="admin">Admin</option>
<option value="user">User</option>
</select>
</td>
<td>
<input type="checkbox" onChange={e => {
if (e.target.checked) {
setSelectedUsers([...selectedUsers, user]);
} else {
setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
}
}} />
</td>
</tr>
))}
</tbody>
</table>
<div>
<label htmlFor="duration">Invite valid for:</label>
<input type="number" id="duration" value={inviteDuration} onChange={e => setInviteDuration(e.target.value)} />
<button onClick={handleInvite}>Invite Selected Users</button>
</div>
</div>
);
};

export default AdminDashboard;

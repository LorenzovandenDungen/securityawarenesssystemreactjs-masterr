import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUserRole,
  sendTrainingInvite,
  getTrainings,
  importUsersFromCsv,
} from "../firebase";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Employee");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [trainingOptions, setTrainingOptions] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState("");
  const [inviteExpiryTime, setInviteExpiryTime] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }

    async function fetchTrainings() {
      const fetchedTrainings = await getTrainings();
      const trainingOptions = fetchedTrainings.map((training) => {
        return { label: training.title, value: training.id };
      });
      setTrainingOptions(trainingOptions);
    }

    fetchUsers();
    fetchTrainings();
  }, []);

  const handleCreateUser = async () => {
    await createUser(newUserName, newUserEmail, newUserRole);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Employee");
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  const handleUserRoleChange = async (user, newRole) => {
    await updateUserRole(user.id, newRole);
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        u.role = newRole;
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  const handleSendTrainingInvite = async () => {
    await Promise.all(
      selectedUsers.map((user) =>
        sendTrainingInvite(selectedTraining, user.email, inviteExpiryTime)
      )
    );
    setSelectedUsers([]);
    setSelectedTraining("");
    setInviteExpiryTime("");
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleImportUsersFromCsv = async () => {
    if (!csvFile) {
      return;
    }
    await importUsersFromCsv(csvFile);
    setCsvFile(null);
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  const handleSendTrainingInviteSelected = async () => {
    await Promise.all(
      selectedUsers.map((user) =>
        sendTrainingInvite(selectedTraining, user.email, inviteExpiryTime)
      )
    );
    setSelectedUsers([]);
    setSelectedTraining("");
    setInviteExpiryTime("");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Create User</h2>
        <label>
          Name:
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
        </label>
        <label>
          Role:
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <div>
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUserRoleChange(user, e.target.value)}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Send Training Invite</h2>
        <label>
          Training:
          <select
            value={selectedTraining}
            onChange={(e) => setSelectedTraining(e.target.value)}
          >
            <option value="">--Select Training--</option>
            {trainingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Invite Expiry Time:
          <input
            type="datetime-local"
            value={inviteExpiryTime}
            onChange={(e) => setInviteExpiryTime(e.target.value)}
          />
        </label>
        <label>
          Select Users:
          <select
            multiple
            value={selectedUsers.map((user) => user.id)}
            onChange={(e) =>
              setSelectedUsers(
                Array.from(e.target.selectedOptions, (option) =>
                  users.find((user) => user.id === option.value)
                )
              )
            }
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSendTrainingInvite}>Send Invite</button>
      </div>
      <div>
        <h2>Import Users from CSV</h2>
        <label>
          Select File:
          <input type="file" onChange={handleFileInputChange} />
        </label>
        <button onClick={handleImportUsersFromCsv}>Import</button>
      </div>
    </div>
    );
    };
    
    export default AdminDashboard;       
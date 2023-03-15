import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { database } from "../firebase";

const Employee = ({ auth }) => {
  const [user] = useAuthState(auth);
  const [inviteCode, setInviteCode] = useState("");
  const [invalidCode, setInvalidCode] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const trainingsSnapshot = await database.ref("trainings").once("value");
        const trainings = trainingsSnapshot.val();
        if (trainings) {
          const trainingsArray = Object.keys(trainings).map((key) => ({
            id: key,
            ...trainings[key],
          }));
          setTrainings(trainingsArray);
        }
      } catch (error) {
        console.log("Error fetching trainings", error);
      }
    };
    fetchTrainings();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradesSnapshot = await database.ref(`grades/${user.uid}`).once("value");
        const grades = gradesSnapshot.val();
        if (grades) {
          const gradesArray = Object.keys(grades).map((key) => ({
            id: key,
            ...grades[key],
          }));
          setGrades(gradesArray);
        }
      } catch (error) {
        console.log("Error fetching grades", error);
      }
    };
    fetchGrades();
  }, [user]);

  const handleInviteCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const inviteCodeSnapshot = await database.ref(`inviteCodes/${inviteCode}`).once("value");
      const inviteCodeData = inviteCodeSnapshot.val();
      const now = new Date().getTime();
      if (inviteCodeData && !inviteCodeData.used && inviteCodeData.deadline > now) {
        await database.ref(`inviteCodes/${inviteCode}`).update({ used: true, usedBy: user.uid });
        await database.ref(`employees/${user.uid}/inviteCode`).set(inviteCode);
        setInvalidCode(false);
      } else {
        setInvalidCode(true);
      }
    } catch (error) {
      console.log("Error validating invite code", error);
    }
  };

  return (
    <div>
      <h1 className="employee-heading">Welcome, {user ? user.displayName : "User"}!</h1>
      <h2>Available Trainings:</h2>
      <ul>
        {trainings.map((training) => (
          <li key={training.id}>
            {training.name} - Deadline: {new Date(training.deadline).toDateString()}
          </li>
        ))}
      </ul>
      <h2>My Grades:</h2>
      <table>
        <thead>
          <tr>
            <th>Training</th>
            <th>Attempt</th>
            <th>Score</th>
            <th>Status</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td>{grade.trainingName}</td>
              <td>{grade.attempt}</td>
              <td>{grade.score}</td>
              <td>{grade.approved ? "Approved" : "Pending"}</td>
              <td>{grade.approvedBy ? grade.approvedBy : "-"}</td>
</tr>
))}
</tbody>
</table>
<h2>Enter Invite Code:</h2>
<form onSubmit={handleInviteCodeSubmit}>
<input
type="text"
placeholder="Enter invite code"
value={inviteCode}
onChange={(e) => setInviteCode(e.target.value)}
/>
<button type="submit">Submit</button>
{invalidCode && <p>Invalid or expired invite code.</p>}
</form>
</div>
);
};

export default Employee;

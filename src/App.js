import React from "react";
import { BrowserRouter as Router, Route, Switch, Routes } from "react-router-dom";
import Login from "./Login";
import CompanyLoginPage from "./Company/CompanyLogin";
import AdminLoginPage from "./Admin/Login";
import AdminDashboard from "./Admin/AdminDashboard";
import "./App.css";
import Employee from "./Employee/Employee";
import { auth } from "./firebase";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/employee" element={<Employee auth={auth} />} />
          <Route exact path="/admin" element={<AdminLoginPage />} />
          <Route exact path="/admindashboard" element={<AdminDashboard />} />
          <Route exact path="/company" element={<CompanyLoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

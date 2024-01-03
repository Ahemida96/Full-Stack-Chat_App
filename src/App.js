import './style.scss';
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';


function App() {
  const { currentUser } = useContext(AuthContext);

  // console.log(currentUser);

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <HomePage /> : <AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<h1>Not Found 404</h1>} />
      </Routes>
    </Router>
  );

}

export default App;

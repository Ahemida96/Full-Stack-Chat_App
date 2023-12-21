import './style.scss';
import React, { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { Register, RegisterPage } from './pages/RegisterPage';
// import { auth } from './firebase-config'; // If it doesn't work, try:'./firebase-config.js';
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();



function App() {
  // const [isAuth, setIsAuth] = useState(cookies.get('user-auth-token'));
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <HomePage /> : <AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );

  // if (!isAuth) {
  //   return <AuthPage />
  // } else {
  //   // <HomePage />
  //   <p>Home Page</p>
  // }

}

export default App;

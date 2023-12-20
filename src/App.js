import './App.css';
import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthPage } from './pages/AuthPage';
// import { HomePage } from './components/HomePage';
// import { auth } from './firebase-config'; // If it doesn't work, try:'./firebase-config.js';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


function App() {
  const [isAuth, setIsAuth] = useState(cookies.get('user-auth-token'));

  if (!isAuth) {
    return <AuthPage />
  } else {
    // <HomePage />
    <p>Home Page</p>
  }

}

export default App;

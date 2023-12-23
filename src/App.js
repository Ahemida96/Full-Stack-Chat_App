import './style.scss';
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
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
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="*" element={<h1>Not Found 404</h1>} />
      </Routes>
    </Router>
  );

}

export default App;

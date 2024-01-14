import './style.scss';
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { CallsRoom } from './pages/CallsRoom';
import VideoCall from './components/VideoCall';


function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <HomePage /> : <AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/callsRoom1/:chatId" element={<CallsRoom />} />
        <Route path="/callsRoom/:chatId" element={<VideoCall />} />
        <Route path="*" element={<h1>Not Found 404</h1>} />
      </Routes>
    </Router>
  );

}

export default App;

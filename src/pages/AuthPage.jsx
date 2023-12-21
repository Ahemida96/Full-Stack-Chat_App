import { auth, provider } from '../firebase-config'; // If it doesn't work, try:'../firebase-config.js';
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';


export const AuthPage = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const SignInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider); // If it doesn't work, try: 'auth.signInWithPopup(provider);'
            navigate('/');
        } catch (error) {
            console.error(error);
            setErr(true);
        }
    };

    const SignInWithEmailAndPass = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            navigate('/');
        } catch (error) {
            console.error(error);
            setErr(true);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                {/* <h1>Sign In</h1> */}
                <span className="logo">Progen Chat</span>
                <span className="title">Login</span>
                <form onSubmit={SignInWithEmailAndPass} >
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required />
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required />
                    <a href="/forgot-password">Forgot password?</a>
                    <button type="submit">Sign In</button>
                    {err && <span>Something went wrong</span>}
                    <div class="separator">
                        <center><span>or</span></center>
                    </div>
                    <button onClick={SignInWithGoogle}>Sign In with Google</button>
                </form>
                <p>Don't have an account? <Link to='/register'> Sign Up</Link></p>
            </div>
        </div>

    )
}

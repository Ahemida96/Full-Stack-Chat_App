import './AuthPage.css';

import { auth, provider } from '../firebase-config'; // If it doesn't work, try:'../firebase-config.js';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    signInWithEmailLink,
    signInWithPhoneNumber
} from "firebase/auth";

import React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const AuthPage = () => {

    const SignInWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, provider); // If it doesn't work, try: 'auth.signInWithPopup(provider);'
            console.log(res);
            cookies.set('user-auth-token', res.user.refreshToken);
        } catch (error) {
            console.error(error);
        }
    };

    const signInWithEmailAndPassword = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        try {
            const res = await signInWithEmailAndPassword(auth, email.value, password.value);
            console.log(res);
            cookies.set('user-auth-token', res.user.refreshToken);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div class="container">
            <h1>Sign In</h1>
            <form onSubmit={signInWithEmailAndPassword} >
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required />
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />
                <a href="/forgot-password">Forgot password?</a>
                <button type="submit">Sign In</button>
                <div class="separator">
                    <span>or</span>
                </div>
                <a onClick={SignInWithGoogle}>Sign In with Google</a>
            </form>
            <p>Don't have an account? <a href="/sign-up">Sign Up</a></p>
        </div>

    )
}

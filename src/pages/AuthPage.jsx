import { auth, db, provider } from '../firebase-config';
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import defultImg from '../img/broken-image.png'

import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';


export const AuthPage = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const SignInWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            //check whether user exists in firestore, if not create
            const docRef = doc(db, "users", res.user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName: res.user.displayName,
                    email: res.user.email,
                    photoURL: res.user.photoURL || defultImg,
                });
            }

            //check whether userChats exists in firestore, if not create
              const result = await getDoc(doc(db, "userChats", res.user.uid));
              //create empty user chats on firestore if not exists
                if (!result.exists()){
                    await setDoc(doc(db, "userChats", res.user.uid), {});
                }
              navigate("/");
            } catch (err) {
              console.log(err);
              setErr(true);
            }
            navigate('/');
            
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

import { auth, db, provider } from '../firebase-config';
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import defultImg from '../img/broken-image.png'

import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faLock} from '@fortawesome/free-solid-svg-icons';



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

        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error(error);
            setErr(true);
        }
    };

    return (
    <div class="auth-regpage">
        <div className="wrapper">
            <h1 className="logo">Progen Chat</h1>
            <h2 className="title">login</h2>
            <form onSubmit={SignInWithEmailAndPass} >
                <div class="input-box">
                    <input type="text" placeholder="Name" required/>
                    <FontAwesomeIcon icon={faUser} id='icon'/>  
                </div>
                <div class="input-box">
                    <input type="password" placeholder="password" required/>
                    <FontAwesomeIcon icon={faLock} id='icon'/>
                </div>
                <div class="forgot">
                    <a href="# ">Forgot Password?</a>
                </div>
                <button type="submit" class="btn">login</button>
                {err && <span>Something went wrong</span>}
                <div class="separator">
                    <center><span>or</span></center>
                </div>
                <button onClick={SignInWithGoogle} type="submit" class="btn">login With Google</button>
                <div class="register-link">
                    <p>Don't have an account ? <Link  to='/register'> Sign Up</Link></p>
                </div>
            </form>
        </div>
    </div>
    )
}

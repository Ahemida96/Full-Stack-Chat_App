import { auth, db, provider } from '../firebase-config';
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import defultImg from '../img/broken-image.png'

import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { doc, setDoc } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faLock} from '@fortawesome/free-solid-svg-icons';
import defultImg from '../img/broken-image.png' 



export const AuthPage = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const SignInWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, provider);

            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: res.user.displayName,
                email: res.user.email,
                photoURL: res.user.photoURL || defultImg,
              });
  
              //create empty user chats on firestore
              await setDoc(doc(db, "userChats", res.user.uid), {});
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
        <div class="wrapper">
        <form action="" onSubmit={SignInWithEmailAndPass}>
            <h1>Progen Chat</h1>
            <h2>login</h2>
            <div class="input-box">
                <input type="text" placeholder="Name" required/>
                <FontAwesomeIcon icon={faUser} id='icon'/>
                
            </div>
            <div class="input-box">
                <input type="password" placeholder="password" required/>
                <FontAwesomeIcon icon={faLock} id='icon'/>
            </div>

            <div class="remember-forgot">
                {/* <!-- <label for=""><input type="checkbox">remember me</label> --> */}
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

    )
}

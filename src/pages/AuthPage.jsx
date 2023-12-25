import { auth, provider } from '../firebase-config'; // If it doesn't work, try:'../firebase-config.js';
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
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
        // <div className="formContainer">
        //     <div className="formWrapper">
        //         {/* <h1>Sign In</h1> */}
        //         <span className="logo">Progen Chat</span>
        //         <span className="title">Login</span>
        //         {/* <form onSubmit={SignInWithEmailAndPass} >
        //             <label for="email">Email</label>
        //             <input type="email" id="email" name="email" placeholder='Name' required />
        //             <FontAwesomeIcon icon={faUser} color='white' />
        //             <label for="password">Password</label>
        //             <input type="password" id="password" name="password" placeholder='password' required />
        //             <a href="/forgot-password">Forgot password?</a>
        //             <button type="submit">Sign In</button>
        //             {err && <span>Something went wrong</span>}
        //             <div class="separator">
        //                 <center><span>or</span></center>
        //             </div>
        //             <button onClick={SignInWithGoogle}>Sign In with Google</button>
        //         </form> */}
                
        //         <p>Don't have an account? <Link class='btn' to='/register'> Sign Up</Link></p>
        //     </div>
        // </div>

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

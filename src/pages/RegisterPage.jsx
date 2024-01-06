import {React, useState} from 'react'
import {auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faLock , faPhone ,faEnvelope} from '@fortawesome/free-solid-svg-icons';


export const RegisterPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const Register = async (e) => {
    setLoading(true);
    e.preventDefault();

    console.log(displayName, email, password , phoneNumber);

    try {
      console.log("Registering...");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(res.user);
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: null,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: null,
              phoneNumber,
              friends: [],
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
      } catch (err) {
      setErr(true);
      console.log(err);
      setLoading(false);
      }
      };

  return (
    <div className="auth-regpage">
      <div class="wrapper">
        <h2 className="title">Registeration</h2> 
        <form onSubmit={Register}>
          <div class="input-box">
                  <input type="text" placeholder="Username" required onChange={(e) => setDisplayName(e.target.value)}/>
                  <FontAwesomeIcon icon={faUser} id='icon' />
          </div>

          <div class="input-box">
                  <input type="email" placeholder="Email" required onChange={(e)=>setEmail(e.target.value)}/>
                  <FontAwesomeIcon icon={faEnvelope} id='icon' />
          </div>

          <div class="input-box">
                  <input type="number" placeholder="Phone Number" required onChange={(e)=> setPhoneNumber(e.target.value)}/>
                  <FontAwesomeIcon icon={faPhone} id='icon' />
          </div>

          <div class="input-box">
                  <input type="password" placeholder="password" required onChange={(e)=> setPassword(e.target.value)}/>
                  <FontAwesomeIcon icon={faLock}  id='icon' />
          </div>

          <button type="submit" class="btn">Sign up</button>
          {loading && <span className='loader'> "Uploading and compressing the image please wait..."</span>}
          {err && <span style={{color: 'red'}}>Something went wrong</span>}
          <div class="register-link">
            <p>
              You do have an account? <Link  to='/login'>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;

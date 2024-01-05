import {React, useState} from 'react'
import {auth, db, storage} from '../firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
// import Add from '../img/addAvatar.png'
import defultImg from '../img/broken-image.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faLock , faPhone ,faEnvelope} from '@fortawesome/free-solid-svg-icons';


export const RegisterPage = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const Register = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const img = e.target[3].files[0] || defultImg;
    console.log(displayName, email, password, img);

    try {
      console.log("Registering...");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res.user);
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
      } catch (err) {
      setErr(true);
      console.log(err);
      setLoading(false);
      }
      };

  return (
  <div class="wrapper">
        <form onSubmit={Register}>
        <h1>Registeration</h1>
        <div class="input-box">
                <input type="text" placeholder="Username" required/>
                <FontAwesomeIcon icon={faUser} id='icon' />
        </div>
        <div class="input-box">
                <input type="email" placeholder="Email" required/>
                <FontAwesomeIcon icon={faEnvelope} id='icon' />
        </div>
        <div class="input-box">
                <input type="number" placeholder="Phone Number" required/>
                <FontAwesomeIcon icon={faPhone} id='icon' />
        </div>
        <div class="input-box">
                <input type="password" placeholder="password" required/>
                <FontAwesomeIcon icon={faLock}  id='icon' />

          {/* <label for=""><input type="checkbox"/> I heraby declare the above information provided is true and correct</label> */}
          <button type="submit" class="btn">Sign up</button>
          {loading && <span className='loader'> "Uploading and compressing the image please wait..."</span>}
          {err && <span style={{color: 'red'}}>Something went wrong</span>}
          <div class="register-link">
            <p>
              You do have an account? <Link  to='/login'>Login</Link>
            </p>
          </div>
          </div>
        </form>
      </div>
  );
};
export default RegisterPage;

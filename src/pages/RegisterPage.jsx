import {React, useState} from 'react'
import {auth, db, storage} from '../firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import Add from '../img/addAvatar.png'

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
    const img = e.target[3].files[0];
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
      console.log("The email address is already in use by another account.");
      setLoading(false);
      }
      };

  return (
    <div className="formContainer">
    <div className="formWrapper">
      <span className="logo">Progen Chat</span>
      <span className="title">Register</span>
      <form onSubmit={Register} >
        <input required type="text" placeholder="display name" />
        <input required type="email" placeholder="email" />
        <input required type="password" placeholder="password" />
        <input required style={{ display: "none" }} type="file" id="file" />
        <label htmlFor="file">
          <img src={Add} alt="" />
          <span>Add an avatar</span>
        </label>
        <button >Sign up</button>
        {loading && "Uploading and compressing the image please wait..."}
        {err && <span>Something went wrong</span>}
      </form>
      <p>
        You do have an account? <Link to='/login'>Login</Link>
      </p>
    </div>
  </div>
  );
};
export default RegisterPage;

import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faPhone,faEnvelope, faCamera,faClose} from '@fortawesome/free-solid-svg-icons';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {db, storage} from '../firebase-config';
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function Profile() {
    const { currentUser } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(currentUser.displayName);
    const [email, setEmail] = useState(currentUser.email);
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber);

    const profilePicRef = useRef();
    const inputFileRef = useRef();
    const updateProfilePic = () => {
        profilePicRef.current.src = URL.createObjectURL(inputFileRef.current.files[0]);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('profile updating');
        console.log(displayName, email, phoneNumber)
        // const username = e.target[1].value;
        // const email = e.target[2].value;
        // const phoneNumber = e.target[3].value;

        // Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${currentUser.displayName + date}`);

        await uploadBytesResumable(storageRef, profilePicRef).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
                try {
                    //Update profile
                    await updateProfile(currentUser, {
                        photoURL: profilePicRef? downloadURL: currentUser.photoURL,
                        displayName : displayName? displayName: currentUser.displayName,
                        email: email? email: currentUser.email,
                        phoneNumber: phoneNumber? phoneNumber: currentUser.phoneNumber,
                    });
                    //create user on firestore
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        displayName : displayName? displayName: currentUser.displayName,
                        email : email? email: currentUser.email,
                        photoURL: profilePicRef? downloadURL: currentUser.photoURL,
                        phoneNumber : phoneNumber? phoneNumber: currentUser.phoneNumber,
                    });
                } catch (err) {
                    console.log("Coudn't update profile, Try again later", err);
                }
            });
        });
        console.log('profile updated');
    }
    return(
        <div className='profile'>

        <FontAwesomeIcon icon={faClose} id='closeicon' />
                <div className="hero" >
                <div className="card">
                    <h1>Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <img ref={profilePicRef} src={currentUser.photoURL} alt="" id="profile-pic" />
                        <label htmlFor="input-file"><FontAwesomeIcon icon={faCamera} id='cicon'/></label>
                        <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file" className="img" ref={inputFileRef} onChange={updateProfilePic} />
                        <div className="input-box">
                            <input type="text" placeholder="Username" value={displayName} onChange={e => setDisplayName(e.target.value)}/>
                            <FontAwesomeIcon icon={faUser} id='icon' />
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            <FontAwesomeIcon icon={faEnvelope} id='icon' />
                        </div>
                        <div className="input-box">
                            <input type="number" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
                            <FontAwesomeIcon icon={faPhone} id='icon' />
                        </div>
                        <button type="submit" className="btn" >Update</button>
                    </form>
                </div>
                </div>
                </div>
    )}

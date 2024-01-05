import React, { useContext, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faPhone,faEnvelope, faCamera,faClose} from '@fortawesome/free-solid-svg-icons';



export default function MultipleSelectCheckmarks() {
    const { currentUser } = useContext(AuthContext)

    const profilePicRef = useRef();
    const inputFileRef = useRef();
    const updateProfilePic = () => {
        profilePicRef.current.src = URL.createObjectURL(inputFileRef.current.files[0]);
    }
    return(
        <div>

        <FontAwesomeIcon icon={faClose} id='closeicon' />
                <div className="hero" >
                <div className="card">
                    <img ref={profilePicRef} src={currentUser.photoURL} alt="" id="profile-pic" />
                    <label htmlFor="input-file"><FontAwesomeIcon icon={faCamera} id='cicon'/></label>
                    <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file" className="img" ref={inputFileRef} onChange={updateProfilePic} />
                    <div className="input-box">
                    <input type="text" placeholder="Username"  />
                    <FontAwesomeIcon icon={faUser} id='icon' />
                    </div>
                    <div className="input-box">
                    <input type="email" placeholder="Email"  />
                    <FontAwesomeIcon icon={faEnvelope} id='icon' />
                    </div>
                    <div className="input-box">
                    <input type="number" placeholder="Phone Number"  />
                    <FontAwesomeIcon icon={faPhone} id='icon' />
                    </div>
                    <button type="submit" className="btn" >Update</button>
                </div>
                </div>
                </div>
    )}
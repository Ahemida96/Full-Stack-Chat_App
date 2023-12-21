import React, { useContext } from 'react'
import {signOut} from 'firebase/auth'
import {auth} from '../firebase-config'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='navbar'>
      <span className='logo'>Progen</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>log out</button>
      </div>
    </div>
  )
}

export default Navbar
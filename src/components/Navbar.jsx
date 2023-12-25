import React, { useContext } from 'react'
import {signOut} from 'firebase/auth'
import {auth} from '../firebase-config'
import { AuthContext } from '../context/AuthContext'
// import setOpen from './Profile'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar'>
      {/* <span className='logo'>Progen</span> */}
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span className='AddGroup'></span>
        <span className='logout' onClick={()=>signOut(auth)}></span>

        {/* <h4>{currentUser.displayName}</h4> */}
      </div>
    </div>
  )
}

export default Navbar
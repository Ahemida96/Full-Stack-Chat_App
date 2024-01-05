import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';
import { Avatar } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Group from './Group'
import Profile from './Profile'
// import Messages from './Messages'

const Navbar = () => {
  const { currentUser } = useContext(AuthContext)

  let visibility=true;
  const Visibility=()=>{
    const hchats = document.getElementById('hchats');
    const search=document.getElementById('search');
    if(visibility)
    {
      hchats.style.visibility= 'hidden';
      search.style.visibility= 'hidden';
      visibility=false;
  }
    else{
      hchats.style.visibility= 'visible';
      search.style.visibility= 'visible';
      visibility=true;
    }
  }

  const toggle = () => {
    
    Visibility()
    const popup = document.getElementById('popup');
    popup.classList.toggle('active');
}

  const togglegroup = () => {
    Visibility()
    const popupgroup = document.getElementById('popupgroup');
    popupgroup.classList.toggle('active');
}

  return (
    
    <div className='navbar' >
      <div className="user">
        <Avatar
          onClick={toggle}
          alt='Profile Picture'
          src={currentUser.photoURL}
          sx={{ width : 56, height : 56 }}
          style={{border:"none"}}
          />

        <IconButton aria-label="AddGroup" onClick={togglegroup} style={{color:"white"}} >
            <GroupAddIcon />
          </IconButton>
      
        <IconButton  aria-label="logout">
          <LogoutIcon onClick={()=>signOut(auth)}  style={{color:"white" }} />
        </IconButton>
        </div>
        
      <div id="popupgroup" class="users " >
        <Group/>
      </div>

      <div id="popup" >
        <Profile/>
      </div>
      </div>
  )
}

export default Navbar
import React, {useContext, useState} from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallIcon from '@mui/icons-material/Call';
import DuoIcon from '@mui/icons-material/Duo';
import Stack from '@mui/material/Stack';

// import video from '../img/cam.png'
// import call from '../img/icons8-call-32.png'
// import add from '../img/add.png'

const options = [
  'Profile',
  'Delete Chat',
  'Mute Notifications',
  'Wallpaper',
  'Search'
];

const ITEM_HEIGHT = 48;

const Chat = () => {
  const { data } = useContext(ChatContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="video" >
              <DuoIcon />
            </IconButton>

            <IconButton aria-label="call" >
              <CallIcon />
            </IconButton>

            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                  // color: 'white',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </div>
      </div>
        <Messages />
        <Input />
    </div>
  )
}

export default Chat
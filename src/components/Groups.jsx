import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext'
import { setDoc, doc, serverTimestamp, getDocs, query, collection, where } from "firebase/firestore";
import { db } from '../firebase-config';
import { v4 as uuid } from 'uuid';
// import { storage } from '../firebase-config';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import { ChatContext } from '../context/ChatContext';


import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera,faClose} from '@fortawesome/free-solid-svg-icons';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight : ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width : 250,
        },
    },
    };
    
const Group = () => {
    const { currentUser } = useContext(AuthContext)
    const profilePicRef = useRef();
    const [personName, setPersonName] = useState([]);
    const [friends, setFriends] = useState([]);

    // const getFriends = async () => {
    //     try {
    //     const q = query(
    //         collection(db, "users"),
    //         where("uid", "==", currentUser.uid)
    //         );
    //         const querySnapshot = await getDocs(q);
    //         querySnapshot.forEach((doc) => {
    //         setFriends(doc.data().friends);
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    // if (friends.length === 0) {
    //     getFriends();
    // }

    // const names = friends.map((friend) => friend.displayName);
    const names = ['Oliver Hansen', 'Van Henry', 'April Tucker', 'Ralph Hubbard', 'Omar Alexander', 'Carlos Abbott'];
    // console.log(friends);
    // console.log(names);
    

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
        // console.log(personName);
    };

    const createGroup = async () => {
        console.log('new group');
        let groupName = "Test group 3";
        let usersArray = ["7lCpJhgttyXaQyYyO7TtbfEij0E3", "sZbK3vujJhUneLOToo0sYG643sx2"]
        usersArray.push(currentUser.uid);
        
        try {
          let docId = uuid();
    
          // Create a new document in the 'publicChats' subcollection using the docId for each user in the group
          usersArray.forEach(async (user) => {
            console.log(user);
            await setDoc(doc(db, "chats", docId), {
              [user]: { messages: [] },
            });
    
            await setDoc(doc(db, "userChats", user, "publicChats", docId), {
              date: serverTimestamp(),
              "groupInfo": {
                groupId: docId,
                displayName: groupName,
                photoURL: currentUser.photoURL,
                CreaterUid: currentUser.uid,
              },
              users: usersArray,
              lastMessage: {
                text: '',
                createdAt: serverTimestamp(),
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    
      }

    return (    
        <div id='group' className='group'>
        <FontAwesomeIcon icon={faClose} id='closeicon' />
        <div id='group-pic"' className='group-pic"'>
        <img ref={profilePicRef} src={currentUser.photoURL} alt="" id="group-pic" className='group-pic"'/>
        <label htmlFor="input-file"><FontAwesomeIcon icon={faCamera} id='icon'/></label>
        </div>
                    

        <div id='gn' className='gn'>
            {/* <InputLabel for='fn'>Group-Name</InputLabel> */}
            <input type="text" placeholder='Group-Name' />
        </div>

        <div className='users' id='users' >
        <FormControl sx={{ m: 1, width : 250 }} >
            <InputLabel id="demo-multiple-checkbox-label" >Add Friends</InputLabel>
            <Select
            className='select'
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Users"/>}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            >
            {names.map((name) => (
                <MenuItem key={name} value={name}>
                <Checkbox checked={personName.indexOf(name) > -1} />
                <ListItemText primary={name} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        </div>

        <Button variant="contained" MultipleSelectCheckmarks className='btn' id='btn' onClick={createGroup}>
        Create
        </Button>

        
        {/* <Stack direction="row" spacing={2}>
        <Button variant="outlined" startIcon={<PreIcon />} onClick={prev}>
            Pre
        </Button>
        <Button variant="contained" endIcon={<NextIcon />} onClick={next}>
            Next
        </Button>
        </Stack> */}
        </div>
    
    );
}

export default Group;
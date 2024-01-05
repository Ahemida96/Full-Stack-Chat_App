import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Navbar from './Navbar'
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

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
    ];


    export default function MultipleSelectCheckmarks() {
    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };
const { currentUser } = useContext(AuthContext)
const profilePicRef = useRef();

    return (    
        <div id='group' className='group'>
        <FontAwesomeIcon icon={faClose} id='closeicon' onClick={<Navbar/>} />
        <div id='group-pic"' className='group-pic"'>
        <img ref={profilePicRef} src={currentUser.photoURL} alt="" id="group-pic" className='group-pic"'/>
        <label htmlFor="input-file"><FontAwesomeIcon icon={faCamera} id='icon'/></label>
        </div>.
                    

        <div id='gn' className='gn'>
            {/* <InputLabel for='fn'>Group-Name</InputLabel> */}
            <input type="text" placeholder='Group-Name' />
        </div>

        <div className='users' id='users' >
        <FormControl sx={{ m: 1, width : 250 }} >
            <InputLabel id="demo-multiple-checkbox-label">Users</InputLabel>
            <Select
            className='select'
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Users" />}
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

        <Button variant="contained" MultipleSelectCheckmarks className='btn' id='btn'>
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


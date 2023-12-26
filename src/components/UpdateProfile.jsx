import React from 'react'
import {React, useState} from 'react'
import {auth, db, storage} from '../firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const UpdateProfile = async(props)=> {
    const displayName = props.displayName;
    const img = props.img;

    try {
        //Update profile
        await UpdateProfile(res.user, {
          displayName,
          photoURL: img,
        });
    } catch (err) {
        console.log(err);
        // setErr(true);
        // setLoading(false);
    }
  return null
}

export default UpdateProfile
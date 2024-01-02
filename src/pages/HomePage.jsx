import React from 'react'
import Chat  from '../components/Chat'
import Sidebar from '../components/Sidebar'

// const toggle = () => {
//   const blur = document.getElementById('blur');
//   blur.classList.toggle('active');
//   const popup = document.getElementById('popup');
//   popup.classList.toggle('active');
// }

export const HomePage = () => {
  return (
    <div className='home'>
      <div className='container'>
          <Sidebar  />
          <Chat/>
      </div>
    </div>
  )
}

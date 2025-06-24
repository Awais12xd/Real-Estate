import React from 'react'
import { getAuth, GoogleAuthProvider , signInWithPopup} from 'firebase/auth'
import {app} from '../firebase.js'
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../features/user/userSlicer.js';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleClick =async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app);
            const result = await signInWithPopup(auth,provider);
        
            const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials : "include",
                body: JSON.stringify({
                    email: result.user.email,
                    username: result.user.displayName,
                    photo: result.user.photoURL,

                }),
                });
                const data = await res.json();
                dispatch(signInSuccess(data?.data));
                navigate("/")


        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    }
  return (
    <div>
      <button type='button' onClick={handleClick} className='bg-red-600 w-full text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50'>Continue with Google</button>
    </div>
  )
}

export default OAuth

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate , useLocation } from 'react-router-dom'
import {signInFailure,signInStart,signInSuccess} from "../features/user/userSlicer.js"
import { useDispatch,useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
import Toast from '../components/Toast.jsx';

const SignIn = () => {
  const location = useLocation();
   const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData , setFormData] = useState({});
  const {currentUser,error,loading} = useSelector((state) => state.user);
  const [toastMessage, setToastMessage] = useState(null);


  useEffect(() => {
     if (location.state?.toast) {
      setToastMessage(location.state.toast);
      // Clear the state so it's not reused if user refreshes
      window.history.replaceState({}, "");
    }
  } ,[location])
      
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill all fields"));
      return;
    }

   dispatch(signInStart());
   try{
     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-in` ,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include"
      }
    )
    const data = await res.json();
    if (data.success === false) {
     dispatch(signInFailure(data.message));
      return;
    }
      dispatch(signInSuccess(data.data));
      console.log(data)
     navigate("/", {
      state: { toast: "✅ Sign In Successful! Welcome to our Website!" },
    });

   } catch (error) {
       dispatch(signInFailure(error.message));
   }
  }
    

  return (
   <>
  <div>
  <div className='px-3 max-w-lg mx-auto'>
       <h1 className='text-3xl font-semibold text-center my-4'>Sign In</h1>
 
       <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        
         <input type="email" placeholder='email' id='email' onChange={handleChange}
         className="rounded-lg border border-slate-400  p-3 outline-none"
         />
         <input type="password" placeholder='password' id='password' onChange={handleChange}
         className="rounded-lg border border-slate-400  p-3 outline-none"
         />
         <button disabled={loading} className='bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50'>
            {loading ? "Loading..." : "Sign In"}
         </button>
         <OAuth/>
       </form>
 
       <div className='flex mt-3'>
         <p>
         Don't have an account?
         <Link to={"/sign-up"}>
            <span className='text-blue-700 cursor-pointer ms-2'>Sign Up</span>
         </Link>
         </p></div>
         <div className="">
           {error &&
           <p className='text-red-500 text-sm mt-2'>{error}</p>
           }
         </div>
     </div>  
     <Toast
        isVisible={!!toastMessage}
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      /> 
     
      </div>
   </>
  )
}

export default SignIn

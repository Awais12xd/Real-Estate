import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';


const SignUp = () => {
  const navigate = useNavigate();

  const [formData , setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
      
  const handleChange = (e) => {
     
    setFormData({...formData, [e.target.id]: e.target.value});

  }

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
   try {
     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register` ,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      }
    )
    const data = await res.json();
    setLoading(false);
    if (data.success === false) {
      setError(data.message);
      return;
    }
    setError(null);
     if (data.success) {
    console.log(data);
     }
     navigate("/sign-in");

   } catch (error) {
       const errorRes = error.message;
       console.log(errorRes);
   }
  }
  
    
  return (
    <div>
 <div className='px-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-4'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="text" placeholder='username' id='username'  onChange={handleChange}
        className="rounded-lg border border-slate-400  p-3 outline-none"
        />
        <input type="email" placeholder='email' id='email' onChange={handleChange}
        className="rounded-lg border border-slate-400  p-3 outline-none"
        />
        <input type="password" placeholder='password' id='password' onChange={handleChange}
        className="rounded-lg border border-slate-400  p-3 outline-none"
        />
        <button disabled={loading} className='bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50'>
           {loading ? "Loading..." : "Sign Up"}
        </button>
         <OAuth/>
      </form>

      <div className='flex mt-3'>
        <p>
        Have an account?
        <Link to={"/sign-in"}>
           <span className='text-blue-700 cursor-pointer ms-2'>Sign in</span>
        </Link>
        </p></div>
        <div className="">
          {error &&
          <p className='text-red-500 text-sm mt-2'>{error}</p>
          }
        </div>
    </div>   
    
     </div>
  )
}

export default SignUp

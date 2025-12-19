import React, { useState , useEffect} from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {

    const [landlord , setLandlord] =  useState({})
    console.log(landlord)
    const [message , setMessage] = useState("")
    const handleChange = (e) =>{
        setMessage(e.target.value);
    }
     useEffect(() => {
         const fetchListing = async () => {
           const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${listing.userRef}`,
            {
              method: 'GET',
              credentials : "include"

            }
           );
           const data = await res.json();
           if (!data.success) {
             alert(data.message || "Landlord fetch failed");
             return;
         };
         setLandlord(data.data);

        }
         fetchListing();
       }, [listing.userRef]);

  return (
    <div className='flex flex-col gap-1'>
      {/* hello  */}
      {
        landlord && <>
            <p>Contact <span className='font-semibold'>{landlord?.username}</span> for <span className='font-semibold'>{listing?.name}</span></p>
            <textarea id="message"
             placeholder="Your Message..."
            required
            className="w-full  rounded-lg border border-slate-400 p-3 outline-none"
             rows={3}
            onChange={handleChange}
            value={message}
            ></textarea>
            <Link
            to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}
            className='bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 w-full  text-center'>
           Send Message
        </Link>

        </>
      }
    </div>
  )
}

export default Contact

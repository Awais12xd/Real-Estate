import React,{useState , useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {Swiper , SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import "swiper/css/bundle"
import { FaLocationDot } from "react-icons/fa6";
import { FaBath, FaBed, FaChair, FaParking } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';



const Listing = () => {
    SwiperCore.use([Navigation]);
    const {currentUser} = useSelector((state) => state.user)

      const { id } = useParams();
      const [imageUrls , setImageUrls] = useState([])
      const [contact , setContact] = useState(false);
      const [listingData, setListingData] = useState({
          name: "",
          description: "",
          address: "",
          regularPrice: 0,
          discountPrice: 0,
          bedrooms: 0,
          bathrooms: 0,
          parking: false,
          furnished: false,
          offer: false,
          sell: false,
          rent: false,
          userRef:""
        });
      const [loading , setLoading] = useState(false)
   
     useEffect(() => {
       try {
         const fetchListing = async () => {
          setLoading(true)
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/single-listing/${id}`);
          const data = await res.json();
          if (!data.success) {
            alert(data.message || "Listing fetch failed");
            return;
          }
          const listing = data.data;
          setListingData({
            name: listing.name,
            description: listing.description,
            address: listing.address,
            regularPrice: listing.regularPrice,
            discountPrice: listing.discountPrice,
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            parking: listing.parking,
            furnished: listing.furnished,
            offer: listing.offer,
            sell: listing.sell,
            rent: listing.rent,
            userRef:listing.userRef
          });
          setImageUrls(listing?.images)
          setLoading(false)

        };
        fetchListing();
       } catch (error) {
         console.error(error.message);
       }
      }, [id]);


  return (
    <main>
     <div className="">
         {
          loading && <p className='text-xl text-center font-semibold mt-4'>Loading...</p>
         }
      {!loading && listingData && <>
      <Swiper navigation={true} >
         {
            imageUrls.map((image) => (
                <SwiperSlide key={image}>
                    <div className="h-[550px]" style={{background : `url(${image}) center no-repeat`, backgroundSize : "cover" }}>

                    </div>

                </SwiperSlide>
            ))
         }

      </Swiper>
      <div className="my-5 flex flex-col gap-2 max-w-6xl mx-auto px-3">
        <div className="flex gap-2 text-xl sm:text-3xl font-bold mb-2">
            <h1>{listingData?.name} - </h1>
            <p>
             ${
                listingData?.discountPrice > 0 ?
                 listingData?.discountPrice.toLocaleString("en-us") 
                : listingData?.regularPrice.toLocaleString("en-us")
            }
            {listingData?.rent === true && " / month" }
            </p>
        </div>
       <p className='flex gap-2 items-center'> <FaLocationDot className='text-xl text-green-600'/> {listingData?.address} </p>
       <div className="flex gap-2">
       {
        listingData?.discountPrice > 0 && (
      <p className='bg-green-700 text-white px-6 py-3 w-full max-w-[200px] text-center rounded-md'>
        ${
        listingData?.discountPrice > 0 && parseInt(listingData?.regularPrice)-parseInt(listingData?.discountPrice)
       } OFF
       </p>
        )
       }
       <p className='bg-red-700 text-white px-6 py-3 w-full max-w-[200px] text-center rounded-md'>
          {listingData?.rent === true ? "For Rent" : "For Sale"}
       </p>
       </div>
       <p className='text-slate-800'>
        
        <span className='text-black font-semibold'>Description - {" "}</span> {listingData?.description}
       </p>
       <ul className='flex gap-4 mb-2 sm:gap-6 text-green-900 text-sm font-semibold flex-wrap'>
        <li className='flex items-center gap-1'>
            <FaBath className='text-green-900' />
           <span className='text-green-900 text-sm font-semibold'> {listingData?.bathrooms} </span>

            {listingData?.bathrooms > 1 ? "Baths" : "Bath"}
        </li>
        <li className='flex items-center gap-1'>
            <FaBed className='text-green-900' />
           <span className='text-green-900 text-sm font-semibold'> {listingData?.bedrooms} </span>

            {listingData?.bedrooms > 1 ? "Beds" : "Bed"}
        </li>
        <li className='flex items-center gap-1'>
            <FaParking className='text-green-900' />
            {listingData?.parking ? "Parking Spot" : "No Parking"}
        </li>
         <li className='flex items-center gap-1'>
            <FaChair className='text-green-900' />
            {listingData?.furnished ? "Furnished" : "Not Furnished"}
        </li>
       </ul>
      {
        currentUser && currentUser._id !== listingData.userRef && !contact &&
          <button onClick={() => setContact(true)}  className='bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50'>
           Contact Landlord
        </button>
      }
      {
        contact && <Contact listing={listingData} />
      }
      </div>
      </>}
     </div>
    </main>
  )
}

export default Listing

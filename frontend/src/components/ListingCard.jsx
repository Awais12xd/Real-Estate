import React from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import "../App.css"

const ListingCard = ({listingData}) => {
    
  return (
    <div className='bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-shadow duration-300 w-full sm:w-[330px]'>
        <Link to={`/listing/${listingData?._id}`} className='flex flex-col'>
           <img src={listingData?.images[0]} 
           className='sm:h-[320px] h-[220px] w-full object-cover hover:scale-105 transition-all duration-300'
           alt="Listing Cover" />
           <div className="p-3 flex flex-col gap-2">
            <p className='truncate font-semibold text-xl text-slate-700 w-full'>{listingData?.name}</p>
            <div className="flex gap-1 items-center">
                <FaLocationDot className='text-md text-green-600 ' />
                <p className='text-sm text-gray-700 truncate font-normal'>
                    {listingData?.address}
                </p>
                
            </div>
            <p className='line-clamp-3 text-sm text-gray-600 '>{listingData?.description}</p>
            <p className='flex items-center text-slate-500 font-semibold mt-2'>
                $
                {listingData?.offer ? listingData?.discountPrice.toLocaleString("en-US") : listingData?.regularPrice.toLocaleString("en-US")}
                {listingData?.rent ? " / month" : ""}
            </p>
            <div className="flex gap-2 text-slate-700 text-xs font-bold">
                <p>{listingData?.bedrooms > 1 ? `${listingData?.bedrooms} beds` :
                     `${listingData?.bedrooms} bed`}</p>
                <p>{listingData?.bathrooms > 1 ? `${listingData?.bathrooms} baths` :
                     `${listingData?.bathrooms} bath`}</p>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default ListingCard

import React, { useEffect, useState } from "react";
import { Link , useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard.jsx";
import Toast from "../components/Toast.jsx";

const Home = () => {
  SwiperCore.use([Navigation]);
  const location = useLocation()
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [loadingOffer , setLoadingOffer] = useState(false)
  const [loadingRent , setLoadingRent] = useState(false)
  const [loadingSale , setLoadingSale] = useState(false)
  const [error , setError] =useState(null)
   const [toastMessage, setToastMessage] = useState(null);
  
    useEffect(() => {
      if (location.state?.toast) {
        setToastMessage(location.state.toast);
        // Clear the state so it's not reused if user refreshes
        window.history.replaceState({}, "");
      }
    }, [location]);
 

  useEffect(() => {
    const fetchOfferListings = async () => {
      setLoadingOffer(true)
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/listing/getAllListings?offer=true&limit=4&type=all`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if(data.success === true){
          setLoadingOffer(false)
          setOfferListings(data?.data);
          fetchRentListings();
        }else{
          setLoadingOffer(false)
          setError(data.message)
        }
      } catch (error) {
        setLoadingOffer(false)
        setError(error.message)
      }
    };
    const fetchRentListings = async () => {
      setLoadingRent(true)
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/listing/getAllListings?type=rent&limit=4`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if(data.success === true){
          setLoadingRent(false)
         
          setRentListings(data?.data);
          fetchSaleListings();
        }else{
          setLoadingRent(false)
          setError(data.message)
        }
      } catch (error) {
        setLoadingRent(false)
        setError(error.message)
      }
    };
    const fetchSaleListings = async () => {
      setLoadingSale(true)
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/listing/getAllListings?type=sale&limit=4`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if(data.success === true){
          setLoadingSale(false)
          setError(null)
        setSaleListings(data?.data);
        }else{
          setLoadingSale(false)
          setError(data.message)
        }
      } catch (error) {
        setLoadingSale(false)
        setError(error.message)
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
       <Toast
          isVisible={!!toastMessage}
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl text-slate-700 font-bold ">
          First your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Awais Estate is the best place to find your next perfect place to
          live. <br />
          We have a wide range of properties for you to choose from.
        </p>
        <Link
          className="text-blue-800 text-xs sm:text-sm font-bold hover:underline"
          to={"/search"}
        >
          Let's Get Started...
        </Link>
      </div>
      {
        loadingOffer && (
          <p className="text-md font-semibold my-4">Loading...</p>
        )
      }
     
      <Swiper navigation={true}>
        {offerListings && !loadingOffer &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing?._id}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${listing?.images[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="my-6 max-w-7xl  mx-auto p-5 flex flex-col justify-center gap-10">
        {offerListings && !loadingOffer && offerListings.length > 0 && (
          <div className=" flex flex-col  justify-center">
            <h1 className="md:text-3xl text-2xl text-slate-700 font-semibold ">
              Recent Offers
            </h1>
            <Link
              to={"/search?offer=true&type=all"}
              className="text-blue-800 hover:underline mb-3 self-start"
            >
              Show more offers..
            </Link>
            <div className="flex flex-wrap gap-5  ">
              {offerListings.map((listing) => (
                <ListingCard key={listing._id} listingData={listing} />
              ))}
            </div>
          </div>
        )}
        {
           loadingOffer && (
          <p className="text-md font-semibold my-4">Loading...</p>
        )
        }
        {rentListings && !loadingRent && rentListings.length > 0 && (
          <div className=" flex flex-col  justify-center">
            <h1 className="md:text-3xl text-2xl text-slate-700 font-semibold ">
              Recent Places for rent
            </h1>
            <Link
              to={"/search?type=rent"}
              className="text-blue-800 self-start hover:underline mb-3"
            >
              Show more places for rent..
            </Link>
            <div className="flex flex-wrap gap-5 ">
              {rentListings.map((listing) => (
                <ListingCard key={listing._id} listingData={listing} />
              ))}
            </div>
          </div>
        )}
        {
           loadingRent && (
          <p className="text-md font-semibold my-4">Loading...</p>
        )
        }
        {saleListings && !loadingSale && saleListings.length > 0 && (
          <div className=" flex flex-col  justify-center">
            <h1 className="md:text-3xl text-2xl text-slate-700 font-semibold ">
              Recent Places for sale
            </h1>
            <Link
              to={"/search?type=sale"}
              className="text-blue-800 self-start hover:underline mb-3"
            >
              Show more places for sale..
            </Link>
            <div className="flex flex-wrap gap-5">
              {saleListings.map((listing) => (
                <ListingCard key={listing._id} listingData={listing} />
              ))}
            </div>
          </div>
        )}
        {
           loadingSale && (
          <p className="text-md font-semibold my-4">Loading...</p>
        )
        }
         {
        error && (
          <p className="text-red-500 font-semibold text-center my-5">{error}</p>
        )
      }
      </div>



    </div>
  );
};

export default Home;

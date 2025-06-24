import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard.jsx";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/getAllListings?offer=true&limit=4&type=all`);
        const data = await response.json();
        setOfferListings(data?.data);
        fetchRentListings();
      } catch (error) {
        alert("error while loading offers");
      }
    };
    const fetchRentListings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/listing/getAllListings?type=rent&limit=4`
        );
        const data = await response.json();
        setRentListings(data?.data);
        fetchSaleListings();
      } catch (error) {
        alert("error while loading rents");
      }
    };
    const fetchSaleListings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/listing/getAllListings?type=sale&limit=4`
        );
        const data = await response.json();
        setSaleListings(data?.data);
      } catch (error) {
        alert("error while loading sales");
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
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
      <Swiper navigation={true}>
        {offerListings &&
          offerListings.length > 0 &&
            (
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
              ))
            )}
      </Swiper> 
      <div className="my-6 max-w-7xl  mx-auto p-5 flex flex-col justify-center gap-10">
          {
            offerListings && offerListings.length > 0 && (
              <div className=" flex flex-col  justify-center">
                <h1 className="md:text-3xl text-2xl text-slate-700 font-semibold ">Recent Offers</h1>
                <Link to={"/search?offer=true&type=all"} className="text-blue-800 hover:underline mb-3 self-start">Show more offers..</Link>
                <div className="flex flex-wrap gap-5  ">
                  {
                    offerListings.map((listing) => (
                      <ListingCard key={listing._id}  listingData={listing}  /> 
                    ))
                  }
                </div>
              </div>
            )
          }
           {
              rentListings && rentListings.length > 0 && (
              <div className=" flex flex-col  justify-center">
                <h1 className="md:text-3xl text-2xl text-slate-700 font-semibold ">Recent Places for rent</h1>
                <Link to={"/search?type=rent"} className="text-blue-800 self-start hover:underline mb-3">Show more places for rent..</Link>
                <div className="flex flex-wrap gap-5 ">
                  {
                    rentListings.map((listing) => (
                      <ListingCard key={listing._id}  listingData={listing}  /> 
                    ))
                  }
                </div>
              </div>
            )
          }
           {
              saleListings && saleListings.length > 0 && (
              <div className=" flex flex-col  justify-center">
                <h1 className="md:text-3xl text-2xl text-slate-700 font-semibold ">Recent Places for sale</h1>
                <Link to={"/search?type=sale"} className="text-blue-800 self-start hover:underline mb-3">Show more places for sale..</Link>
                <div className="flex flex-wrap gap-5">
                  {
                    saleListings.map((listing) => (
                      <ListingCard key={listing._id}  listingData={listing}  /> 
                    ))
                  }
                </div>
              </div>
            )
          }
      </div>
    </div>
  );
};

export default Home;

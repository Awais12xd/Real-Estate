import React, { useEffect, useState } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const Search = () => {
  const [seacrhData, setSearchData] = useState({
    searchTerm: "",
    parking: false,
    furnished: false,
    type: "all",
    sort: "createdAt",
    order: "desc",
    offer: false,
  });
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false)
  const [listings , setListings] = useState([]);
  const [showMore , setShowMore] = useState(false)
  const [error, setError] = useState(null)


  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchData({ ...seacrhData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSearchData({ ...seacrhData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSearchData({
        ...seacrhData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSearchData({ ...seacrhData, sort, order });
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", seacrhData.searchTerm);
    urlParams.set("type", seacrhData.type);
    urlParams.set("parking", seacrhData.parking);
    urlParams.set("offer", seacrhData.offer);
    urlParams.set("furnished", seacrhData.furnished);
    urlParams.set("sort", seacrhData.sort);
    urlParams.set("order", seacrhData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

    
    

  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const offerFromUrl = urlParams.get("offer");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || offerFromUrl || furnishedFromUrl || sortFromUrl || orderFromUrl) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchList = async () => {
        setLoading(true)
        setError(null)
     try {
       const seacrhQueryForRequest = urlParams.toString();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/getAllListings?${seacrhQueryForRequest}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        }
      )
      const data = await response.json();
      if(data.data.length > 8){
       setShowMore(true)
      }
      if(data.success){
      setListings(data.data)
      setLoading(false)
      setError(null)
      }
      if(!data.success){
      setLoading(false)
      setError(data.message)
      }
     } catch (error) {
      setLoading(false)
      setError(error.message)
     }
    }
    fetchList();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex" , startIndex)
    const searchQuery = urlParams.toString();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/getAllListings?${searchQuery}`)
    const data = await response.json()
    console.log(data)
    if(data.data.length < 8){
      setShowMore(false)
    }else{
      setShowMore(true)
    }
    setListings([...listings, ...data.data]);
  }

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className=" p-4 border-b border-slate-300 md:border-r-1 md:h-screen md:w-[25%]">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 search">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              id="searchTerm"
              type="search"
              placeholder="Search..."
              onChange={handleChange}
              value={seacrhData.searchTerm}
              className="text-sm outline-none bg-white p-3 rounded-lg w-full"
            />
          </div>
          <div className="check-boxes items-center flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <label htmlFor="" className="font-semibold">
              Type :
            </label>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={seacrhData.type === "all"}
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
              />
              <label className="cursor-pointer text-sm" htmlFor="all">
                rent & sale
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleChange}
                checked={seacrhData.type === "sale"}
              />
              <label className="cursor-pointer text-sm" htmlFor="sale">
                Sale
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleChange}
                checked={seacrhData.type === "rent"}
              />
              <label className="cursor-pointer text-sm" htmlFor="rent">
                Rent
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleChange}
                checked={seacrhData.offer}
              />
              <label className="cursor-pointer text-sm" htmlFor="offer">
                Offer
              </label>
            </div>
          </div>
          <div className="check-boxes items-center flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <label htmlFor="" className="font-semibold">
              Amenities :
            </label>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleChange}
                checked={seacrhData.parking}
              />
              <label className="cursor-pointer text-sm" htmlFor="parking">
                Parking
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleChange}
                checked={seacrhData.furnished}
              />
              <label className="cursor-pointer text-sm" htmlFor="furnished">
                Furnished
              </label>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-3">
            <label className="font-semibold whitespace-nowrap">Sort :</label>
            <select
              id="sort_order"
              className="border px-3 py-2 rounded-lg cursor-pointer "
              onChange={handleChange}
              defaultValue={`${seacrhData.sort}_${seacrhData.order}`}
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 mt-3 w-full">
            Search
          </button>
        </form>
      </div>
      <div className=" flex flex-col md:w-[75%] ">
        <h1 className="text-xl sm:text-3xl text-slate-700 border-b-1 border-slate-300 p-3 mt-2 font-semibold w-full">
          Search Results:
        </h1>
        {error && (
          <p className="text-md text-red-500 font-semibold text-center mt-5">{error}</p>
        )}
        {loading && (
          <p className="text-xl font-semibold text-center mt-5">Loading...</p>
        )}
        {
          !loading && !error && listings.length === 0 && (
            <p className=" mx-4 mt-5">No Listing Found!</p>
          )
        }
       <div className="flex p-4 flex-wrap gap-6 w-full ">
         {
          !loading && !error && listings && (
            listings.map((listing) => (
              
                <ListingCard key={listing._id} listingData={listing} />
             
            ))
         )
        }
       
       </div>
        {
          showMore && (
            <button onClick={handleShowMore} className="self-center cursor-pointer p-7 text-green-600 hover:underline text-center " >
              Show More
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Search;

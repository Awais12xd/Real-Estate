import React, { useState , useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const [searchTerm , setSearchTerm ] = useState("")

  const handleSubmit =async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set ("searchTerm" , searchTerm)
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)

  }

  useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm");
        if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl);
      }
  } ,[location.search])
  
  return (
    <header className="p-3 bg-slate-200 ">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to={"/"}>
          <h1 className="text-sm sm:text-xl font-bold flex flex-wrap">
            <span className="text-slate-600">Sahand</span>
            <span className="text-slate-800">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-2 rounded-lg flex items-center">
            <input type="search" placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm outline-none bg-transparent w-24 sm:w-64 "/>
            <button>
               <FaSearch className="text-slate-500 cursor-pointer"/>
            </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to={"/"}>
            <li className="hover:underline text-slate-700 hidden sm:inline">Home</li>
          </Link>
          <Link to={"/about"}>
            <li className="hover:underline text-slate-700 hidden sm:inline">About</li>
          </Link>
          <Link to={"/sign-up"}>
            {currentUser ? (
              <Link to={"/profile"}>
                 <img  className="rounded-full h-8 w-8 object-cover" src={currentUser?.avatar?.url} alt="Profile" />
                 </ Link>
            ) : (
              <li className="hover:underline text-slate-700 ">Sign in</li>
            )
              
            }
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;

import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className=" p-4 border-b border-slate-300 md:border-r-1 md:h-screen">
        <form>
          <div className="flex items-center gap-2 search">
            <label className="whitespace-nowrap font-semibold">Search Term</label>
            <input
              type="search"
              placeholder="Search..."
              className="text-sm outline-none bg-white p-3 rounded-lg w-full"
            />
          </div>
          <div className="check-boxes items-center flex flex-wrap gap-4  mt-3">
            <label htmlFor="" className="font-semibold">Type :</label>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="all"
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
                
              />
              <label className="cursor-pointer text-sm" htmlFor="offer">
                Offer
              </label>
            </div>
           
          </div>
          <div className="check-boxes items-center flex flex-wrap gap-4  mt-3">
            <label htmlFor="" className="font-semibold">Amenities :</label>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
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
                
              />
              <label className="cursor-pointer text-sm" htmlFor="furnished">
                Furnished
              </label>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-3">
              <label className="font-semibold">Sort :</label>
              <select id="sort_order"
              className="border px-3 py-2 rounded-lg cursor-pointer "
              >
                <option >Price high to low</option>
                <option >Price low to high</option>
                <option >Latest</option>
                <option >Oldest</option>
              </select>
          </div>
          <button  className='bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 mt-3 w-full'>
           Search
        </button>
        </form>
      </div>
      <div className="">
        <h1>Serach Results:</h1>
      </div>
    </div>
  );
};

export default Search;

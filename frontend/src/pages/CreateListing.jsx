import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";

const CreateListing = () => {
  const Navigate = useNavigate();
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
    images: [],
  });

  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading , setLoading] = useState(false)
  const [error , setError] = useState(null)
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviewImages([]);
  };

  const handlePreviewClick = () => {
    const urls = files.map((file) => {
      return {
        id: Math.random().toString(36).substring(2, 9), // unique id
        file,
        url: URL.createObjectURL(file),
      };
    });
    setPreviewImages(urls);
  };

  const handleRemoveImage = (id) => {
    setPreviewImages((prev) => prev.filter((img) => img.id !== id));
    setFiles((prevFiles) =>
      prevFiles.filter((f) => {
        return !previewImages.find((img) => img.id === id && img.file === f);
      })
    );
  };

  const handleListingChange = (e) => {
    const { id, value, type, checked } = e.target;

    setListingData((prev) => {
      return {
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleListingSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Append files individually
    files.forEach((file) => {
      form.append("images", file);
    });

    // Append other fields
    form.append("name", listingData.name);
    form.append("description", listingData.description);
    form.append("address", listingData.address);
    form.append("regularPrice", listingData.regularPrice);
    form.append("discountPrice", listingData.discountPrice);
    form.append("bedrooms", listingData.bedrooms);
    form.append("bathrooms", listingData.bathrooms);
    form.append("furnished", listingData.furnished);
    form.append("parking", listingData.parking);
    form.append("offer", listingData.offer);
    form.append("rent", listingData.rent);
    form.append("sell", listingData.sell);

    // ✅ Check the FormData
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }
     setLoading(true)
     setError(null)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/create`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setLoading(false)
        setError(null)
        Navigate(`/listing/${data.data._id}` , {
          state : { toast: "🎉 Listing Created Successfully" }
        });
        // Optionally reset state
      } else {
        setError(data.message || "Listing creation failed")
        setLoading(false)
      }
    } catch (error) {
      setError(error.message || "Listing creation failed")
      setLoading(false)
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl text-center mb-4 mt-2 font-semibold">
        Create Listing
      </h1>
      <form
        onSubmit={handleListingSubmit}
        className="flex flex-col sm:flex-row w-full mt-5 gap-5"
      >
        <div className="flex flex-col flex-1 gap-5">
          <div className="flex flex-col gap-4 w-full input-boxes">
            <input
              type="text"
              placeholder="Name"
              onChange={handleListingChange}
              id="name"
              min={10}
              max={62}
              className="rounded-lg border border-slate-400  p-3 outline-none"
              required
            />
            <textarea
              placeholder="Description"
              id="description"
              className="rounded-lg border border-slate-400  p-3 outline-none"
              required
              onChange={handleListingChange}
            />
            <input
              type="text"
              placeholder="Address"
              id="address"
              onChange={handleListingChange}
              className="rounded-lg border border-slate-400  p-3 outline-none"
              required
            />
          </div>
          <div className="check-boxes flex flex-wrap gap-6 sm:justify-between">
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="parking"
                onChange={handleListingChange}
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
              />
              <label className="cursor-pointer text-sm" htmlFor="parking">
                Parking Spot
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="sell"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleListingChange}
              />
              <label className="cursor-pointer text-sm" htmlFor="sell">
                Sell
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleListingChange}
              />
              <label className="cursor-pointer text-sm" htmlFor="offer">
                Offer
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleListingChange}
              />
              <label className="cursor-pointer text-sm" htmlFor="furnished">
                Furnished
              </label>
            </div>
            <div className="flex  items-center gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="cursor-pointer rounded-lg border border-slate-400 p-3 outline-none"
                onChange={handleListingChange}
              />
              <label className="cursor-pointer text-sm" htmlFor="rent">
                Rent
              </label>
            </div>
          </div>
          <div className="Number-boxes-rooms flex gap-3 mt-3">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedrooms"
                className=" rounded-lg border w-14 text-center border-slate-400 py-2 outline-none"
                min={1}
                onChange={handleListingChange}
                max={10}
                required
              />
              <label className="cursor-pointer text-sm" htmlFor="bedrooms">
                Bedrooms
              </label>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bathrooms"
                onChange={handleListingChange}
                className=" rounded-lg w-14 border  text-center border-slate-400 py-2 outline-none"
                min={1}
                max={10}
                required
              />
              <label className="cursor-pointer text-sm" htmlFor="bathrooms">
                Bathrooms
              </label>
            </div>
          </div>
          <div className="Number-boxes-prices flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="regularPrice"
                onChange={handleListingChange}
                className=" rounded-lg border w-24 text-center border-slate-400 py-2 outline-none"
                required
              />
              <div className=" flex flex-col">
                <label
                  className="cursor-pointer text-sm"
                  htmlFor="regularPrice"
                >
                  Regular Price
                </label>
                <span className="text-xs">( $ / month)</span>
              </div>
            </div>
            {listingData.offer && (
              <div className="flex items-center gap-2 ">
                <input
                  type="number"
                  id="discountPrice"
                  className=" rounded-lg border w-24 text-center border-slate-400 py-2 outline-none"
                  required
                  min={0}
                  onChange={handleListingChange}
                />
                <div className=" flex flex-col">
                  <label
                    className="cursor-pointer text-sm"
                    htmlFor="discountPrice"
                  >
                    Discount Price
                  </label>
                  <span className="text-xs">( $ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 gap-4 flex flex-col">
          <div className="images flex gap-2">
            <h3 className="font-semibold uppercase">images</h3>
            <span className="font-sm">
              The first image will be the cover. (max 3)
            </span>
          </div>
          <div className=" flex items-center gap-2">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="rounded-lg border border-slate-400 p-3 outline-none w-full "
            />
            <button
              type="button"
              onClick={handlePreviewClick}
              className="rounded-lg border border-green-400 text-green-500  p-3 outline-none h-12 uppercase cursor-pointer"
            >
              prewiew
            </button>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              <h2 className="font-semibold">Selected Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewImages.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.url}
                      alt="preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="cursor-pointer  absolute top-1 right-1 bg-red-600 text-white rounded-full py-1 px-2 text-xs"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button disabled={loading} className="bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-no-drop uppercase">
           {loading ? "Loading..." : "CREATE listing"}
          </button>
          {
            error && (
              <p className="text-red-600 text-md mt-3">{error}</p>
            )
          }
        </div>
      </form>

    </main>
  );
};

export default CreateListing;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  });
  const [files, setFiles] = useState([]); // New files
  const [previewImages, setPreviewImages] = useState([]); // Will contain both old URLs and new files
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/single-listing/${id}`,
        {
          method: "GET",
          credentials:"include"
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Listing fetch failed");
        return;
      }
      const listing = data.data;

      // Set listing data
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
      });
      // Set existing images
      setExistingImages(listing.images || []);
      setPreviewImages(listing.images.map((url) => ({ id: url, url, isExisting: true })));
    };
    fetchListing();
  }, [id]);

  const handleListingChange = (e) => {
    const { id, value, type, checked } = e.target;
    setListingData((prev) => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
  };

 const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const newFiles = selectedFiles.map((file) => {
    const id = Math.random().toString(36).substring(2, 9);
    return { id, file };
  });
  
  const newPreviews = newFiles.map((f) => ({
    id: f.id,
    url: URL.createObjectURL(f.file),
    isExisting: false,
  }));

  setFiles((prev) => [...prev, ...newFiles]);
  setPreviewImages((prev) => [...prev, ...newPreviews]);
};



 const handleRemoveImage = (imgId) => {
  const removedImage = previewImages.find((img) => img.id === imgId);
  
  setPreviewImages((prev) => prev.filter((img) => img.id !== imgId));

  if (removedImage.isExisting) {
    // It's an existing image
    setExistingImages((prev) => prev.filter((url) => url !== removedImage.id));
  } else {
    // It's a new uploaded file
    setFiles((prev) => prev.filter((f) => f.id !== imgId));
  }
};



  const handleListingSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    files.forEach((f) => {
    form.append("images", f.file);
  });

  // Append updated listing data
  for (const key in listingData) {
    form.append(key, listingData[key]);
  }

  // Append existing images
  form.append("existingImages", JSON.stringify(existingImages));

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/update/${id}`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Update failed");
        return;
      }
      alert("Listing updated successfully");
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };
  
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl text-center mb-4 mt-2 font-semibold">Edit Listing</h1>
      <form onSubmit={handleListingSubmit} className="flex flex-col sm:flex-row w-full mt-5 gap-5">
        <div className="flex flex-col flex-1 gap-5">
          
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={listingData.name}
            onChange={handleListingChange}
            required
            className="rounded-lg border border-slate-400 p-3 outline-none"
          />
          
          <textarea
            placeholder="Description"
            id="description"
            value={listingData.description}
            onChange={handleListingChange}
            required
            className="rounded-lg border border-slate-400 p-3 outline-none"
          />
          
          <input
            type="text"
            placeholder="Address"
            id="address"
            value={listingData.address}
            onChange={handleListingChange}
            required
            className="rounded-lg border border-slate-400 p-3 outline-none"
          />

          <div className="check-boxes flex flex-wrap gap-4">
            {["parking", "sell", "offer", "furnished", "rent"].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  id={key}
                  type="checkbox"
                  checked={listingData[key]}
                  className="cursor-pointer"
                  onChange={handleListingChange}
                />
                <label htmlFor={key} className="cursor-pointer">{key}</label>
              </div>
            ))}
          </div>

          <div className="Number-boxes-rooms flex gap-3 mt-3">
            <div className="flex items-center gap-2">
              <input
                id="bedrooms"
                type="number"
                value={listingData.bedrooms}
                onChange={handleListingChange}
                required
                className="rounded-lg border w-14 text-center border-slate-400 py-2 outline-none"
              />
              <label htmlFor="bedrooms">Bedrooms</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="bathrooms"
                type="number"
                value={listingData.bathrooms}
                onChange={handleListingChange}
                required
                className="rounded-lg w-14 border text-center border-slate-400 py-2 outline-none"
              />
              <label htmlFor="bathrooms">Bathrooms</label>
            </div>
          </div>

          <div className="Number-boxes-prices flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2">
              <input
                id="regularPrice"
                type="number"
                value={listingData.regularPrice}
                onChange={handleListingChange}
                required
                className="rounded-lg border w-24 text-center border-slate-400 py-2 outline-none"
              />
              <div className="flex flex-col">
                <label htmlFor="regularPrice">Regular Price</label>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {listingData.offer && (
              <div className="flex items-center gap-2">
                <input
                  id="discountPrice"
                  type="number"
                  value={listingData.discountPrice}
                  onChange={handleListingChange}
                  required
                  className="rounded-lg border w-24 text-center border-slate-400 py-2 outline-none"
                />
                <div className="flex flex-col">
                  <label htmlFor="discountPrice">Discount Price</label>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 gap-4 flex flex-col">
          <div className="images flex gap-2">
            <h3 className="font-semibold uppercase">Images</h3>
            <span className="font-sm">The first image will be the cover. (max 3)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="rounded-lg border border-slate-400 p-3 outline-none w-full"
            />
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
                      className="cursor-pointer absolute top-1 right-1 bg-red-600 text-white rounded-full py-1 px-2 text-xs"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button className="bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 uppercase">
            Update Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;


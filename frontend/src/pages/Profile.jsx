import React, { useRef, useState , useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, userDeleteStart, userDeleteSuccess ,userDeleteFailure , signOutFailure , signOutStart , signOutSuccess } from "../features/user/userSlicer.js";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [listings, setListings] = useState([]);
  const [isListings , setIsListings] = useState(false);
  const passRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [newImg, setNewImg] = useState(null);
  const [formData, setFormData] = useState({})
  let jugar = true;

const handleOnChangePic = async (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  const preview = URL.createObjectURL(selectedFile);
  setPreviewUrl(preview);
  setFile(selectedFile); // only for preview

  setFormData((prev) => ({
    ...prev,
    image: selectedFile,
  }));
};

  useEffect(() => {
  return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const form = new FormData();

  if (formData.image) form.append("image", formData.image);
  if (formData.username) form.append("username", formData.username);
  if (formData.email) form.append("email", formData.email);
  if (formData.password) form.append("password", formData.password);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/updateProfile/${currentUser._id}`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const data = await response.json();

    if (response.ok) {
      setNewImg(data.data.avatar.url);
      dispatch(updateUser(data.data));
      alert("Profile updated successfully!");
      passRef.current.value = ""; 
    } else {
      alert(data.message || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  const handleChange = (e) => {
  const { id, value } = e.target;
  setFormData((prev) => {
    const updated = { ...prev, [id]: value };
    console.log(updated);
    return updated;
  });
};

const handleDelete = async () => {
  try {
    dispatch(userDeleteStart());
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      dispatch(userDeleteSuccess(data.data));
      return;
    }
    if(data.success === false) {
      dispatch(userDeleteFailure(data.message));
    }
  } catch (error) {
    dispatch(userDeleteFailure(error.message));
  }
}




const handleSignOut = async () => {
  try {
    dispatch(signOutStart());
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-out`,
      {
        credentials: "include"
      }
    );
    const data = await response.json();
    if(data.success === false) {
      dispatch(signOutFailure(data.message));
      return;
    }
    dispatch(signOutSuccess());
  } catch (error) {
    dispatch(signOutFailure(error.message));
  }
}

const handleShowListing = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/listings/${currentUser._id}`,
      {
          method: "GET",
          credentials: "include",
          headers: {
              "Content-Type": "application/json"
          }
      }
    );
    const data = await res.json();
    console.log(data)
    if (!data.success) {
      alert(data.message || "Failed to fetch listings");
      return;
    }
    setListings(data.data);
    setIsListings((prev) => !prev);
  } catch (error) {
    alert("Something went wrong while showing listings.");
    console.log(error.message)
    setIsListings(false);
  }
};

const handleDeleteListing = async (listingId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/delete/${listingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

    })
    const data = await response.json();
    if(data.success === false) {
      alert(data.message || "Failed to delete listing");
      return;
    }
    setListings((prev) =>
      prev.filter((listing) => listing._id !== listingId)
    );
  } catch (error) {
     alert("Something went wrong while deleting listing.");
  }
}

const handleEditListing = (listingId) => {
     navigate(`/update-listing/${listingId}`)
}





  return (
    <div>
      <div className="flex flex-col justify-center px-3 max-w-lg mx-auto mb-5">
        <h1 className="text-3xl font-semibold text-center my-4">Profile</h1>
        <input
          onChange={handleOnChangePic}
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileInputRef.current.click()}
          className="w-24 h-24 rounded-full object-cover self-center mb-4"
          src={ previewUrl || currentUser?.avatar?.url }
          alt="profile"
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser?.username}
            id="username"
            className="rounded-lg border border-slate-400  p-3 outline-none"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="email"
            defaultValue={currentUser?.email}
            id="email"
            className="rounded-lg border border-slate-400  p-3 outline-none"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="password"
            ref={passRef}
            id="password"
            className="rounded-lg border border-slate-400  p-3 outline-none"
            onChange={handleChange}
          />
          <button
            type="submit"

            className="bg-slate-800 text-white p-3 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 uppercase" 
          >
            update
          </button>
          <Link to={"/create-listing"} className="bg-green-700 text-white p-3 rounded-lg hover:opacity-90 text-center transition-all duration-300 cursor-pointer uppercase"> 
          Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-4">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
       <div className="mt-4 flex flex-col justify-center">
  <span
    onClick={handleShowListing}
    className="text-green-700 text-center cursor-pointer text-normal"
  >
    Show Listings yes
  </span>

  {isListings && (
    listings.length > 0 ? (
      <>
        <h1 className="text-3xl text-center font-semibold my-8">Your Listings yes</h1>
        {listings.map((listing) => (
          <div
            key={listing._id || listing.id}
            className="flex flex-col mt-3 gap-7 shadow-2xl p-3"
          >
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <img
                  className="w-28 h-20 object-cover"
                  src={listing.images[0]}
                  alt={listing.name}
                />
                <p>{listing.name}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 cursor-pointer"
                >
                  Delete
                </span>
                <span
                  onClick={() => handleEditListing(listing._id)}
                  className="text-green-700 cursor-pointer"
                >
                  Edit
                </span>
              </div>
            </div>
          </div>
        ))}
      </>
    ) : (
      <span className="">No listings Found</span>
    )
  )}
</div>

      </div>
    </div>
  );
};

export default Profile;

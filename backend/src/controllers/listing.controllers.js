import { Listing } from "../models/listing.model.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import fs from "fs";

const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      rent,
      sell,
      offer,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return next(new ApiError(400, "Please provide at least one image"));
    }

    // Upload files to Cloudinary
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.secure_url) {
        uploadedImages.push(result.secure_url);
      }
      // Delete the temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      rent,
      sell,
      offer,
      images: uploadedImages,
      userRef: req.user._id,
    });

    res
      .status(201)
      .json(new apiResponse(201, listing, "Listing created successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllUserListings = async (req, res, next) => {
  if (req.params.id == req.user._id) {
    try {
      const listings = await Listing.find({ userRef: req.user._id });

      res
        .status(200)
        .json(
          new apiResponse(200, listings, "All listings fetched successfully")
        );
    } catch (error) {
      next(error);
    }
  } else {
    return next(new ApiError(403, "You can only access your own listings"));
  }
};

const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ApiError(404, "Listing not found"));
  }

  if (listing.userRef.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, "You can only delete your own listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json(new apiResponse(200, "Listing deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new ApiError(404, "Listing not found"));
    }
    if (listing.userRef.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You can only update your own listings"));
    }

    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      rent,
      sell,
      offer,
      existingImages,
    } = req.body;

    // Parse existingImages if it's sent as a JSON string
    const existingImagesArray = Array.isArray(existingImages)
      ? existingImages
      : JSON.parse(existingImages || "[]");

    // Start with existing images
    let updatedImages = [...existingImagesArray];

    // Append any new uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result?.secure_url) {
          updatedImages.push(result.secure_url);
        }
        // Clean up the temp files
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // Perform the listing update
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        address,
        regularPrice,
        discountPrice,
        bedrooms,
        bathrooms,
        furnished,
        parking,
        rent,
        sell,
        offer,
        images: updatedImages,
      },
      { new: true }
    );

    if (!updatedListing) {
      return next(new ApiError(404, "Listing not found while updating"));
    }

    res
      .status(200)
      .json(new apiResponse(200, updatedListing, "Listing updated successfully"));
  } catch (error) {
    next(error);
  }
};


const getSingleListing = async (req , res , next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(new ApiError(404, "Listing not found"));
            }
            res.json(new apiResponse(200, listing, "Listing found successfully"));
    } catch (error) {
         next(error);
    }
}

const getAllListings = async (req , res , next) => {
   
        try {
             const limit = parseInt(req.query.limt) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
    if(offer === "false" || offer === undefined){
        offer = { $in : [false, true]}
    }
    if(furnished === "false" || furnished === undefined){
        furnished = { $in : [false, true]}
    }
    if(parking === "false" || parking === undefined){
        parking = { $in : [false, true]}
    }

    let rent ,sell;
    if(type === "false" || type === "all"){
         rent =  { $in : [false, true]}
         sell =  { $in : [false, true]}
    }
    if(type === "rent"){
      rent = true;
      sell = false;
    }
    if(type === "sale"){
      sell = true;
      rent = false;
    }

    
    const searchTerm = req.query.searchTerm || "";
    const order = req.query.order || "desc"
    const sort = req.query.sort || "createdAt"



    const listings = await Listing.find(
        {
            name :{$regex : searchTerm , $options : "i"},
            offer,
            furnished,
            parking,
            sell,
            rent
        }
    ).sort(
        {[sort] : order}
    ).limit(limit).skip(startIndex);
       
    res.json(new apiResponse(200, listings, "Listings found successfully"));

        } catch (error) {
            next(error)
        }
}


export { createListing, getAllListings, deleteListing, updateListing , getSingleListing , getAllUserListings};

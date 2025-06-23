import { apiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js";
import bcrypt from "bcryptjs";
const userController = (req , res)=> {
    res.
    json(new apiResponse(200, {username: "JohnDoe"},"User data retrieved successfully"))
} 

const updateProfileImage =async (req , res , next) => {
   try {

     const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) return next(new ApiError(404, "User not found"));

  const localPath = req?.file?.path;
  console.log("Local path:", localPath);
  if (!localPath) return next(new ApiError(400, "No image provided"));

  // Delete old Cloudinary image if it exists
  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  // Upload new image
  const cloudImg = await uploadOnCloudinary(localPath);
  if (!cloudImg) return next( new ApiError(500, "Upload failed"));

  // Update user
  user.avatar = {
    url: cloudImg.secure_url,
    public_id: cloudImg.public_id
  };
  await user.save();

  res.status(200).json(new apiResponse(200, user, "Profile image updated"));
   } catch (error) {
         next(error);
      
   }

}

const updateProfile = async (req, res, next) => {

  if(req?.user?.id !== req?.params?.id) {
    return next(new ApiError(403, "You can only update your own profile"));
  }
   const userId = req.params?.id;
  try {

  const user = await User.findById(userId);
   const localPath = req?.file?.path;
  console.log("Local path:", localPath);

  if (localPath){
     if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  const cloudImg = await uploadOnCloudinary(localPath);
  if (!cloudImg) return next( new ApiError(500, "Upload image failed"));

   user.avatar = {
    url: cloudImg.secure_url,
    public_id: cloudImg.public_id
  };
    await user.save();

  }

    if(req?.body?.password) {
     req.body.password= bcrypt.hashSync(req.body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id, 
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            }
        },
        { new: true }

    )
    if (!updatedUser) return next(new ApiError(404, "User not found while updating profile"));
    
    const { password, ...rest } = updatedUser._doc;

    res
    .status(200)
    .json(new apiResponse(200, rest, "Profile updated successfully"));



  } catch (error) {
    next(error);
    
  }


}

 const deleteUser = async (req, res, next) => {
 if(req?.user?.id !== req?.params?.id) {
    return next(new ApiError(403, "You can only delete your own profile"));
  }

  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return next(new ApiError(404, "User not found while deleting profile"));

    // Delete user avatar from Cloudinary if it exists
    if (user.avatar) {
      await deleteFromCloudinary(user.avatar.public_id);
    }
    res
    .status(200)
    .clearCookie("access_token")
    .json(new apiResponse(200, "Profile deleted successfully"));
    } catch (error) {
      next(error);
      }

 }

 const getUser = async (req , res , next ) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user){
      return next(new ApiError(404, "User not found"))
    }

    const {password:pass , ...rest} = user._doc;
    res
    .status(200)
    .json(new apiResponse(200, rest, "User found successfully"));
  } catch (error) {
     next(error);
  }

 }


  

export { userController , updateProfileImage , updateProfile , deleteUser , getUser }
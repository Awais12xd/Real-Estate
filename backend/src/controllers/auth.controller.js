import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

const authController = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return next(new ApiError(400, "Please fill all the fields"));
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return next(new ApiError(409, "Username or email already exists"));
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
       avatar: {
      url: "https://up.yimg.com/ib/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&pid=Api&rs=1&c=1&qlt=95&w=114&h=114",
      public_id: null
  }
    });

    if (!user) {
      return next(new ApiError(500, "User creation failed"));
    }

    return res
      .status(201)
      .json(new apiResponse(201, user, "User created successfully"));
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "Please fill all the fields"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid credentials"));
    }
     let { password: userPassword, ...rest } = user._doc;

    const token = await user.generateToken();
     const loggedInUser = await User.findById(user._id)
     if(!loggedInUser){
      return next(new ApiError(404, "User not found in logging"));
      }

    return res
      .status(200)
      .cookie("access_token" , token , {httpOnly : true})
      .json(new apiResponse(200, rest, "Login successful"));
  } catch (error) {
    next(error);
  }
}

const googleController = async (req, res, next) => {
try {
  const user = await User.findOne({ email: req.body.email }); ;
  
  if (user) {
    const token = await user.generateToken();
    let { password: userPassword, ...rest } = user._doc;
    return res
      .status(200)
      .cookie("access_token" , token , {httpOnly : true})
      .json(new apiResponse(200, rest, "Login successful"));
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword= await bcrypt.hash(generatedPassword,10);
    const newUser = await User.create({
      username: req.body.username.trim().toLowerCase().replace(/\s+/g, "") + Math.random().toString(36).substring(2, 6),
     email: req.body.email,
      password: hashedPassword,
      avatar:req.body.photo
    });
    if (!newUser) {
      return next(new ApiError(500, "User creation failed"));
    }
    const token = await newUser.generateToken();
    let { password: userPassword, ...rest } = newUser._doc;
    return res
    .status(200)
    .cookie("access_token" , token , {httpOnly : true})
    .json(new apiResponse(200, rest, "User created and logged in successfully"));
  }

  } catch (error) {
    next(error);
  }

}

const signOutController = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    return res.status(200).json(new apiResponse(200, null, "Logged out successfully"));
    
  } catch (error) {
    next(error);
  }
}


export { authController , loginController , googleController , signOutController};

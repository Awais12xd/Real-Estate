import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js"

export const verifyToken = async (req, _, next) => {
  const token =   req.cookies?.access_token  || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(404, "Unauthorized error no token");
  }

  try {
    const decodedToken = jwt.verify(
        token,
         process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
        "-password"
    )
    if (!user) {
        throw new ApiError(404, "User not found in auth middleware");
    }
    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, "Invalid accesstoken");

  }
};

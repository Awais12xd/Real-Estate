import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is missing"],
    },
    avatar: {
      url: {
        type: String,
        default:
          "https://up.yimg.com/ib/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&pid=Api&rs=1&c=1&qlt=95&w=114&h=114",
      },
      public_id: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// using bcrypt to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparing both of them
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating token Token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.emal,
    },
    process.env.ACCESS_TOKEN_SECRET
  );
};

// userSchema.methods.generateRefreshToken = function() {
//   return jwt.sign({
//     _id:this._id,
//     role:this.role
//   },
//   process.env.REFRESH_TOKEN_SECRET,
//   {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//   }
// )
// }

export const User = mongoose.model("User", userSchema);

//this middleware is going to check the validity of the token then enable the access of the routes

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Controllers/auth.js";
import User from "../modules/user.js";

//how to make sure the user is signed in
export const requireSignin = (req, res, next) => {
  //   console.log("REQ HEADERS => ", req.headers);
  try {
    const decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

//How to make sure the user is admin
//we must first sign in to be able to check if the user is admin, thereby getting the id and query the database so if admin, get the admins privilage
export const isAdmin = async (req, res, next) => {
  try {
    //
    const user = await User.findById(req.user._id); //findbyid is a mongo function that is used for querring now this will give us the user id as the result.

    if (user.role !== 1) {
      return res.status(401).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

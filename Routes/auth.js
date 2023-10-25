//router
import express from "express";

const router = express.Router();

//middleware
import { isAdmin, requireSignin } from "../middleware/auth.js";

//controller functions
import { register } from "../Controllers/auth.js";
import { login } from "../Controllers/auth.js";
import { secret } from "../Controllers/auth.js";

//this is a register route with a router function
router.post("/register", register);
//login route with the login function
router.post("/login", login);

//this is going to be used in the client side to see if the  as a verification to a particular route
//the call back function can be put in a controller function but since it is simple can be wrriten here

router.get("/auth-check",requireSignin, (req, res)=>{
    res.json({ok: true})
})
router.get("/admin-check",requireSignin, isAdmin, (req, res)=>{
    res.json({ok: true})
})



//testing
router.get("/secret", requireSignin, isAdmin, secret); // now this means that this route is only available for loged in users this is by adding the middleware
//"requireSignin"

export default router;

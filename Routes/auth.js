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

//testing
router.get("/secret", requireSignin, isAdmin, secret); // now this means that this route is only available for loged in users this is by adding the middleware
//"requireSignin"

export default router;
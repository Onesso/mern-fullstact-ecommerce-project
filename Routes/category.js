//router
import express from "express";

const router = express.Router();

//middleware
import { isAdmin, requireSignin } from "../middleware/auth.js";

//
import { create, update, remove, list, read } from "../Controllers/category.js";

//CRUD 
router.post("/category", requireSignin, isAdmin, create);
router.put("/category/:categoryId", requireSignin, isAdmin, update);
router.delete("/category/:categoryId", requireSignin, isAdmin, remove);
router.get("/categories", list);
router.get("/category/:slug", read);

export default router;

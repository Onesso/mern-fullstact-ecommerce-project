//router
import express from "express";
import Formidable from "express-formidable"; // this allows me to work with the form data i.e. be able to upload image to the server and database

const router = express.Router();

//middleware
import { isAdmin, requireSignin } from "../middleware/auth.js";

//importing controller function
import {
  create,
  list,
  read,
  photo,
  remove,
  update,
  filteredProducts,
  productCount,
  listProducts,
  productSearch,
  relatedProduct,
  getToken,
  processPayment,
  updateStatus
} from "../Controllers/product.js";

router.post("/product", requireSignin, isAdmin, Formidable(), create); //ExpressFormidable is applied as a middleware on this specific route.
router.get("/products", list); //geting the entire list of products
router.get("/product/:slug", read); //getting a single product
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignin, isAdmin, remove);
router.put("/product/:productId", requireSignin, isAdmin, Formidable(), update);
router.post("/filtered-products", filteredProducts);
router.get("/products-count", productCount); //this is used for pagination
router.get("/list-products/:page", listProducts); //return the total number of products
router.get("/products/search/:keyword", productSearch);
router.get("/related-product/:productId/:categoryId", relatedProduct);
router.get("/braintree/token", getToken);
router.post("/braintree/payment",requireSignin, processPayment);
router.put("/order-status/:orderId", requireSignin, isAdmin, updateStatus);

export default router;

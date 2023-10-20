import Product from "../modules/product.js";
import fs from "fs";
import slugify from "slugify";
import product from "../modules/product.js";

export const create = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation

    if (!name || !name.trim()) {
      return res.json({ error: "name is required" });
    }
    if (!description || !description.trim()) {
      return res.json({ error: "description is required" });
    }
    if (!price) {
      return res.json({ error: "price is required" });
    }
    if (!category) {
      return res.json({ exor: "category is required" });
    }
    if (!quantity) {
      return res.json({ error: "quantity is required" });
    }
    if (!shipping) {
      return res.json({ error: "shipping is required" });
    }
    if (photo && photo.size > 1000000) {
      return res.json({ error: "image should be less than 1mb in size" });
    }

    // create product
    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//list all the products, to improve time effiency the product is call with the images, the imagaes are large.
export const list = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category") // this will be going to return the id and name of the category, this is possible because in our schema we saved the objectID
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

//read a single product
export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.json({ product });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

//this controller is getting the image from the database
export const photo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "photo"
    );
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);

      return res.send(product.photo.data);
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

//remove a single product
export const remove = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");

    res.json(removed);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

//upload product
export const update = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation

    if (!name || !name.trim()) {
      return res.json({ error: "name is required" });
    }
    if (!description || !description.trim()) {
      return res.json({ error: "description is required" });
    }
    if (!price) {
      return res.json({ error: "price is required" });
    }
    if (!category) {
      return res.json({ exor: "category is required" });
    }
    if (!quantity) {
      return res.json({ error: "quantity is required" });
    }
    if (!shipping) {
      return res.json({ error: "shipping is required" });
    }
    if (photo && photo.size > 1000000) {
      return res.json({ error: "image should be less than 1mb in size" });
    }

    const product = await Product.findByIdAndUpdate(req.params.productId, {
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

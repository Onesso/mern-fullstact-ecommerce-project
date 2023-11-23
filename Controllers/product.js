import Product from "../modules/product.js";
import fs from "fs";
import slugify from "slugify";
// import product from "../modules/product.js";
import braintree from "braintree";
import Order from "../modules/order.js";

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
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
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
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

//read a single product
export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.json(product);
  } catch (error) {
    console.log(error);
    res.json(error);
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
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//remove a single product
export const remove = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");

    res.json(removed);
  } catch (error) {
    console.log(error);
    res.json(error);
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
      return res.json({ error: "category is required" });
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
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//how to find products based on categories and price
export const filteredProducts = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let arrgs = {};

    //checking if we have category so that we can populate the agrs object's

    if (checked.length > 0) arrgs.category = checked;
    if (radio.length) arrgs.price = { $gte: radio[0], $lte: radio[1] };
    console.log("this is what the arrgs conatins => ", arrgs);

    //the above two line will receive the selected category and price from client and save it to arrgs, therefore enabling querring
    const products = await Product.find(arrgs);
    console.log("the result from the querry", arrgs.length);
    res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//for pagination will display six product
export const listProducts = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

//returns the total amount of products available
export const productCount = async (req, res) => {
  try {
    const totalProducts = await Product.find({}).estimatedDocumentCount();
    res.json(totalProducts);
  } catch (error) {
    console.log(error);
  }
};

//this function queries the database based on the keyword searching in the name and description
export const productSearch = async (req, res) => {
  try {
    const { keyword } = req.params; //it is in the params where the keyword from the client via the router.
    const result = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ], // searching for products where the name or the description matches the keyword
    }).select("-photo");

    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const relatedProduct = async () => {
  try {
    const { productId, categoryId } = req.params;
    const related = await Product.find({
      category: categoryId,
      _id: { $ne: productId }, //not equal to the specified productId; excluding the productId
    })
      .select("-photo")
      .populate("category")
      .limit(3);
    res.json(related);
  } catch (error) {
    console.log(error);
  }
};

//account variables
const BRAINTREE_MERCHANT_ID = "yb7kbmcx42fp45kd";
const BRAINTREE_PULIC_KEY = "jgt4rm8vvtxt33m5";
const BRAINTREE_PRIVATE_KEY = "0993c60ff1f861198eacacf3b7c8f9f1";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: BRAINTREE_MERCHANT_ID,
  publicKey: BRAINTREE_PULIC_KEY,
  privateKey: BRAINTREE_PRIVATE_KEY,
});

//this function generate the token
export const getToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, responce) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(responce);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const processPayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;

    cart.forEach((product) => {
      total += product.price;
    });

    console.log("total price:", total);

    const transaction = await gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (transaction) {
      const order = new Order({
        product: cart,
        payment: transaction,
        buyer: req.user._id,
      });

      await order.save();
      decrementQuantity(cart);
      res.json({ ok: true });
      console.log(transaction);
    } else {
      res.status(500).send(error);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
//decrement function
const decrementQuantity = async (cart) => {
  try {
    // build mongodb query
    const bulkOps = cart.map((item) => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -0, sold: +1 } },
        },
      };
    });

    const updated = await Product.bulkWrite(bulkOps, {});
    console.log("blk updated", updated);
  } catch (err) {
    console.log(err);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status });
    res.json(order);
  } catch (error) {
    console.log(error);
  }
};

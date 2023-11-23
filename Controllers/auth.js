/**
 * thing to fix befoare saving user to the db
 * add validation
 * check if email is taken
 * then hash the password
 * json file of the information is send back to postman now the encrpted password will be visible hence the use of json web token
 */
import User from "../modules/user.js";
import { hashpassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
export const JWT_SECRET = "InY0urDi & bzM0faKas";
import Order from "../modules/order.js";

//register function
export const register = async (req, res) => {
  try {
    //1. destructure the name, email, password from req.body
    const { name, email, password } = req.body;
    //2. validate all the fields
    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "The password must be 6 characters long" });
    }

    //3. check if the email is taken
    const exsistEmail = await User.findOne({ email });
    if (exsistEmail) {
      return res.json({ error: "The email is already taken" });
    }
    //4. Hash the password
    const hashedPassword = await hashpassword(password);

    //5. register user
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    //6. create a signed web token: 1st argument is the user id, 2nd argument is the secret, 3rd expirary date
    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    //
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    //7. send reponce: the responce is send as the token with the other details
    res.json({
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        user: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

//login function
export const login = async (req, res) => {
  try {
    //1. destructure the name, email, password from req.body
    const { email, password } = req.body;

    //2. validate all the fields
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "The password must be 6 characters long" });
    }

    //3. check if the email is taken
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "user not found" });
    }

    //4. compare the password - from the database the hased password is save in the "password catalog"
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ err: "Wrong password!!" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    //7. send reponce: the responce is send as the token with the other details
    res.json({
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        user: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, password, address } = req.body;
    const user = await User.findById(req.user._id);

    //check password length
    if (password && password.length < 6) {
      return res.json({ error: "Password must have 6 characters or more" });
    }
    //hash the password
    const hashedPassword = password ? await hashpassword(password) : undefined;

    //update
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        password: hashedPassword || req.user.password,
        address: address || req.user.address,
      },
      {
        new: true,
      }
    );
    updated.password = undefined;

    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};

export const secret = async (req, res) => {
  res.json({ curentUser: req.user });
};

export const getOrders = async (req, res) => {
  try {
    //we are getting the ordersbased on the buyers
    const orders = await Order.find({ buyer: req.user._id })
      .populate("product", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrders = async(req, res) => {
  try{
    const orders = await Order.find({})
    .populate("buyer", "name")
    .populate("product", "-photo");
  res.json(orders);
  }catch(error){
    console.log(error);
  }
};




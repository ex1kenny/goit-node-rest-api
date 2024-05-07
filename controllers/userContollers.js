import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.js";

import HttpError from "../helpers/HttpError.js";
async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const saltPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: saltPassword });
    await newUser.save();
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {}

async function LogoutUser(req, res, next) {}

async function currentUser(req, res, next) {}

export default {
  registerUser,
  loginUser,
  LogoutUser,
  currentUser,
};

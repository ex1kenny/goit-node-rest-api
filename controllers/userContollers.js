import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.js";

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
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    await User.findByIdAndUpdate(user.id, { token });
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function LogoutUser(req, res, next) {
  try {
    const { email } = req.body;
    await User.findOneAndUpdate({ email }, { token: null });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}

async function currentUser(req, res, next) {
  try {
    const user = req.user;

    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
}

export default {
  registerUser,
  loginUser,
  LogoutUser,
  currentUser,
};

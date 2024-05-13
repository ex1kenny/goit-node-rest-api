import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.js";
import Jimp from "jimp";
import crypto from "crypto";
import HttpError from "../helpers/HttpError.js";

async function registerUser(req, res, next) {
  try {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const saltPassword = await bcrypt.hash(password, salt);
    const avatar = (email) => {
      const hashAvatar = crypto.createHash("md5").update(email).digest("hex");
      return `https://gravatar.com/avatar/${hashAvatar}.jpg?d=robohash`;
    };
    const newUser = new User({
      email,
      password: saltPassword,
      subscription,
      avatarURL: avatar(email),
    });
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
      expiresIn: "24h",
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

async function updateAvatar(req, res, next) {
  try {
    if (!req.file) throw new HttpError(400);

    Jimp.read(req.file.path, (err, img) => {
      if (err) throw err;
      img
        .resize(100, 100) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(path.join("public", "avatars", req.file.filename)); // save
    });

    const { email } = req.user;

    await User.findOneAndUpdate(
      { email },
      { avatarURL: `avatars/${req.file.filename}` }
    );

    res.status(200).json({ avatarURL: `avatars/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
}

export default {
  registerUser,
  loginUser,
  LogoutUser,
  currentUser,
  updateAvatar,
};

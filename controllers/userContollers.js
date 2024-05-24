import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.js";
import Jimp from "jimp";
import gravatar from "gravatar";
import { sendEmail } from "../helpers/mail.js";
import crypto from "crypto";
import HttpError from "../helpers/HttpError.js";
import fs from "fs";
import path from "path";

async function registerUser(req, res, next) {
  try {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const saltPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const avatar = gravatar.url(email, { s: "200", d: "robohash" }, true);
    const newUser = new User({
      email,
      password: saltPassword,
      subscription,
      avatarURL: avatar,
      verificationToken,
    });

    const verifiEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${process.env.BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };
    await sendEmail(verifiEmail);
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
    if (!user.verify) throw HttpError(401, "Email not verifed");
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
    if (!req.file) throw new HttpError(400, "No file uploaded");

    const tmp = req.file.path;
    const readPath = path.join("public", "avatars", req.file.filename);

    const img = await Jimp.read(tmp);
    await img.resize(100, 100).quality(60).greyscale().writeAsync(readPath);

    await fs.promises.unlink(tmp);

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

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      return res.status(400).json({ message: "User already verified" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  try {
    const { email } = req.body;

    if (error) throw HttpError(400, error);

    const user = await User.findOne({ email });

    if (user.verify)
      throw new HttpError(400, "Verification has already been passed");

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${process.env.BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
      message: "Verification email sent",
    });
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
  resendVerifyEmail,
  verifyEmail,
};

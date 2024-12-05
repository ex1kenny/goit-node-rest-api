import User from "../model/user.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

export const userAuthToken = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer")
      return res.status(401).json({ message: "Not authorized" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) throw new HttpError(401);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

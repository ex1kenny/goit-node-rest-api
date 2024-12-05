import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

export default function database() {
  mongoose
    .connect(DB_URI)
    .then(() => console.log("Database connection successfully"))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

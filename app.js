import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import database from "./db.js";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

import { swaggerSpec } from "./helpers/swager.js";
// import baardRouter from "./routes/baardRouter.js";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

database();
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// app.use("/api/baard", baardRouter);
app.use("/api/contacts", contactsRouter);
app.use("/users", usersRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

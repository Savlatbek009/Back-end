import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth.js";
import ProductRoutes from "./routes/products.js";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import hbsHelper from "./utils/index.js";

import * as dotenv from "dotenv";
import middlewareAS from "./middleware/var.js";
import userMiddleware from "./middleware/user.js";
dotenv.config();

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: hbsHelper,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(session({ secret: "AS", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(middlewareAS);
app.use(userMiddleware);

app.use(AuthRoutes);
app.use(ProductRoutes);

const startApp = () => {
  try {
    const PORT = process.env.PORT || 5000;
    mongoose.set("strictQuery", false);
    mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
      },
      () => {
        console.log("mongo db connected");
      }
    );
    app.listen(PORT, () => {
      console.log("server is running on port: " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();

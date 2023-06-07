import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../services/token.js";
import check from "../middleware/check.js";

const router = Router();

router.get("/login", check, (req, res) => {
  res.render("login", {
    title: "AS EXPRESS SHOP - LOGIN",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/register", check, (req, res) => {
  res.render("register", {
    title: "AS EXPRESS SHOP - REGISTER",
    isRegister: true,
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("loginError", "Input your all informations");
    res.redirect("/login");
    return;
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    req.flash("loginError", "User not found!");
    res.redirect("/login");
    return;
  }
  const isPasswordEqual = await bcrypt.compare(password, existUser.password);
  if (!isPasswordEqual) {
    req.flash("loginError", "Password isn't match");
    res.redirect("/login");
    return;
  }
  const token = generateJWTToken(existUser._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    req.flash("registerError", "Input your all informations");
    res.redirect("/register");
    return;
  }

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    req.flash("registerError", "User already registered!");
    res.redirect("/register");
    return;
  }

  const hiddenPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    firstName: firstname,
    lastName: lastname,
    email: email,
    password: hiddenPassword,
  };
  const user = await User.create(userData);
  const token = generateJWTToken(user._id);
  console.log(token);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

export default router;

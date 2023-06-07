import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import user from "../middleware/user.js";
import Product from "../models/Product.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("index", {
    title: "AS || EXPRESS SHOP",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  });
});

router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const myProducts = await Product.find({ user }).populate("user").lean();
  res.render("products", {
    title: "AS EXPRESS SHOP - MY PRODUCTS",
    isProducts: true,
    myProducts: myProducts,
  });
});
router.get("/add", authMiddleware, (req, res) => {
  if (!req.cookies.token) {
    res.redirect("/register");
    return;
  }
  res.render("add", {
    title: "AS EXPRESS SHOP - ADD",
    isAdd: true,
    errorAddProducts: req.flash("errorAddProducts"),
  });
});

router.post("/add-product", user, async (req, res) => {
  const { title, description, img, price } = req.body;

  if (!title || !description || !img || !price) {
    req.flash("errorAddProducts", "Input your all informations");
    res.redirect("/add");
    return;
  }
  console.log(req.userId);
  await Product.create({ ...req.body, user: req.userId });
  res.redirect("/");
});

export default router;

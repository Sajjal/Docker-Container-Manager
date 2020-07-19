const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { addData, expiredToken, searchData } = require("../config/dbConfig");

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.post("/signup", async (req, res) => {
  const user = await searchData("users", { username: req.body.username });
  if (user.length > 0) return res.render("login", { message: "User already Exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const data = { username: req.body.username, password: hashedPassword };

  try {
    await addData("users", data);
    return res.render("login", { message: "Registration Successful ! Please Login !" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  //Check if user is in DataBase
  const user = await searchData("users", { username: req.body.username });
  if (user.length < 1) return res.status(400).render("login", { message: "Invalid Username !" });

  //Check for valid password
  const validPassword = await bcrypt.compare(req.body.password, user[0].password);
  if (!validPassword) return res.status(400).render("login", { message: "Invalid Password !" });

  //If everything is valid Create and assign a token. Token Expires in 12 hours
  const accessToken = jwt.sign({ id: user[0]._id }, process.env.TOKEN_SECRET, {
    expiresIn: "43200s",
  });

  //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
  res.cookie("accessToken", accessToken).redirect("/dashboard");
});

router.get("/logout", async (req, res) => {
  const token = req.cookies.accessToken;
  await expiredToken(token);
  res.redirect("/dashboard");
});

module.exports = router;

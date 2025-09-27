import express from "express";
import mongoose from "mongoose";
import { userModel } from "./model/userSchema.js";
const app = express();
const PORT = 4000;
import bcrypt from "bcryptjs";
app.use(express.json());

const MONGODB_URI = "mongodb+srv://class4:class4@cluster0.bjrae2f.mongodb.net/";

mongoose
  .connect(MONGODB_URI)
  .then((res) => {
    console.log("mongodb Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

// signup api
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    return res.json({
      message: "Required Fields are missing!",
      status: false,
    });
  }

  //encrypt password:
  const encryptPassoword = await bcrypt.hash(password, 8);
  console.log(encryptPassoword);

  const userObj = {
    name,
    email,
    password: encryptPassoword,
  };

  //create data on db
  const saveData = await userModel.create(userObj);
  console.log(saveData);

  res.json({
    message: "user created successfully!",
  });
  console.log(req.body);
});

//login api
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Required fields are missing!",
        status: false,
      });
    }

    //get data
    const getdata = await userModel.findOne({ email });
    if (!getdata) {
      res.status(404).json({
        message: "Invalid Credentials!",
        status: false,
      });
    }

    const comparePassword = await bcrypt.compare(password, getdata.password);
    if (!comparePassword) {
      res.status(404).json({
        message: "Invalid Credentials!",
        status: false,
      });
    }

    res.status(200).json({
      message: "Login successfully!",
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error!",
      status: false,
    });
  }
});

//default
app.get("/", (req, res) => {
  res.json({
    message: "server is running!",
  });
});

//server setup
app.listen(PORT, () => {
  console.log("Server is running!");
});

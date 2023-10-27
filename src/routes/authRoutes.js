import User from "../model/userAuthSchema.js";
import argon from "argon2"
import jwt from"jsonwebtoken";
// import config from 'dotenv'
// require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config();

const Signup = async (req, res) => {
    const {name, email, password } = req.body;
    let hashed = await argon.hash(password);
    let existingUser = await User.findOne({ email });
    try {
      if (existingUser) {
        res.send({ message: "Email id already exists" }).status(200);
      }else {
          let user = new User({
            name,
            email,
            password: hashed,
            role: "user",
          });
          await user.save();
          res.status(200).send({ status: true, user: user });
        }
     
    } catch (error) {
      res.send({ error: error });
    }
  };
  
  const findUser = async (data) => {
    let user = await User.findOne({ ...data });
    if (user) {
      return user;
    } else {
      return false;
    }
  };
  
  const validateUser = async (data) => {
    let { email, password } = data;
    try {
      let user = await findUser({ email });
  
      if (user) {
        if (await argon.verify(user.password, password)) {
          return user;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };
  const Login = async (req, res) => {
    let { email, password } = req.body;
    let user = await validateUser({ email, password });
     console.log(user)
      if (user) {
        let token = jwt.sign(
          { email: user.email},
          process.env.TOKEN_SECRET,
          {
            expiresIn: "2 days",
          }
        );
  
        let refreshToken = jwt.sign(
          { email: user.email },
          process.env.REFRESH_TOKEN,
          { expiresIn: "7 days" }
        );
        res
          .status(200)
          .send({
            Message: "User Login successfull",
            token,
            refreshToken,
            email: user.email,
            // role: "user",
          });
      } else {
        return res.send({ status: false, messege: "User not found...please regiter first" });
      }
    // }
  };
  
  const GetAllUser = async (req, res) => {
    let users = await User.find();
  
    try {
      if (users) {
        res.send({ users: users, status: true });
      } else {
        res.send({ status: false, message: "No user found" });
      }
    } catch (error) {
      res.send({ status: false, message: error });
    }
  };
  
  export default{
    Signup,
    Login,
    GetAllUser
  };
  
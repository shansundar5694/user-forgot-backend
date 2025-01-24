import { User } from "../Models/user.schema.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const registerUser = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();
    res.status(200).json({ message: "register success", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "register fail" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const passwordmatch = await bcrypt.compare(password, user.password);
    if (!passwordmatch) {
      return res.status(401).json({ message: "invalid password" });
    }
    res.status(200).json({ message: "login success", data: user });
  } catch (error) {
    console.log(error);
  }
};
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "data fetch success", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();
    const reseturl = `https://jovial-pithivier-e6d03b.netlify.app/reset-password?token=${token}`;
    const mailoptions = {
      from: process.env.EMAIL,
      to: user.email,
      html: `<p>click <a href="${reseturl}">here</a> to reset your password. this link expires in one hour</p>`,
    };
    await transporter.sendMail(mailoptions);
    res.json({ message: "password reset link sent to ur email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error sending reset link" });
  }
};
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(404).json({ message: "user not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "usernot found" });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({ message: "password has been reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server errot" });
  }
};

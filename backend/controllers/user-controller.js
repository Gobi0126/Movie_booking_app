import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Bookings from "../models/Bookings.js";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(req.body);
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "invalid inputs" });
  }
  const hashpassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashpassword });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ id: user._id });
};

export const updateUser = async (req, res, next) => {
  const userid = req.params.id;

  const { name, email } = req.body;
  if (!name && name.trim() === "" && !email && email.trim() === "") {
    return res.status(404).json({ message: "invalid inputs" });
  }

  // const hashpassword=bcrypt.hashSync(password);
  let user;

  try {
    const id = new mongoose.Types.ObjectId(userid);
    user = await User.findByIdAndUpdate(id, { name, email });
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ message: "Updated sucessfully" });
};

export const deleteUser = async (req, res, next) => {
  const userid = req.params.id;
  let user;
  try {
    const id = new mongoose.Types.ObjectId(userid);
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ message: "deleted sucessfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "invalid inputs" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "Unable to find user" });
  }
  const ispassword = bcrypt.compareSync(password, existingUser.password);
  if (!ispassword) {
    return res.status(500).json({ message: "Icorrect password" });
  }
  return res
    .status(200)
    .json({ message: "login sucessfully", id: existingUser._id });
};

export const getBookingsOfUser = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      .populate("movie")
      .populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};

export const getUsersById = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};

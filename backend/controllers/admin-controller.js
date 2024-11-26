import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const addAdmin = async(req,res,next)=>{
  const {email,password}=req.body;
  console.log(email);
  if( !email && email.trim()==="" && !password && password.trim()==="")
  {
      return res.status(422).json({message:"invalid inputs"})
  }
  let existingAdmin;
  try {
     existingAdmin=await Admin.findOne({email});
  }
  catch(err) {
    return console.log(err);
  }

  if(existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }
  
  let admin;
  const hashpassword=bcrypt.hashSync(password);

  try{
     admin=new Admin({email,password:hashpassword});
     admin=await admin.save();
  }
  catch(err) {
    return console.log(err);
  }

  if(!admin){
    return res.status(500).json({ message: "Unable to store admin" });
  }

  return res.status(200).json(admin);
};

export const adminLogin =async(req,res,next)=>{
    const {email,password}=req.body;

    if( !email && email.trim()==="" && !password && password.trim()==="") {
        return res.status(422).json({message:"invalid inputs"})
    }

    let existingAdmin;
      try {
        existingAdmin=await Admin.findOne({email});
      }
      catch(err) {
       return console.log(err);
      }

    if(!existingAdmin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const ispassword=bcrypt.compareSync(password,existingAdmin.password);

    if(!ispassword){
      return res.status(500).json({ message: "Incorrect password" });
    }
    
    const token=jwt.sign({id:existingAdmin._id},"SECRET_KEY",{expiresIn:"7d"});

    return res.status(200).json({ message:"Admin login sucessfully" ,token,id:existingAdmin._id});
    
};

export const getAdmins = async (req,res,next)=>{
  let admins;
  try {
    admins=await Admin.find(); 
  }
  catch(err) {
    return console.log(err);
  }
  if(!admins) {
    return res.status(500).json({ message: "Internal server error!" });
  }
  return res.status(200).json({admins});
}

export const getAdminById = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies");
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return console.log("Cannot find Admin");
  }
  return res.status(200).json({ admin });
};
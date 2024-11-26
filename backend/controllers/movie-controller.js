import { decrypt } from 'dotenv';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Movie from '../models/Movie.js';
import Admin from '../models/Admin.js';
import Bookings from '../models/Bookings.js';

export const addMovie = async(req,res,next) => {
    const extractedToken=req.headers.authorization.split(" ")[1]; 

    if(!extractedToken && extractedToken.trim()==="") {
        return res.status(404).json({message:"Token not found"});
    }   
    let adminId; 
    jwt.verify(extractedToken,"SECRET_KEY",(err,decrypted) => {
      if(err) {
        return res.status(400).json({message:`${err.message}`});
      }
      else {
        adminId=decrypted.id;
        return;
      }
    });

    const {title,description,releaseDate,posterUrl,featured,actors}=req.body;
   
    if(!title && title.trim()==="" && !description && description.trim()===""  && !releaseDate && releaseDate.trim()==="" 
    && !posterUrl && posterUrl.trim()==="" && !featured && featured.trim()==="") {
        return res.status(422).json({message: "Invalid input"});
    }

    let movie;
    try {
       movie=new Movie({
        title,
        description,
        actors,
        releaseDate :new Date(`${releaseDate}`),
        posterUrl,
        featured, 
        admin: adminId
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);

    session.startTransaction();
    await movie.save({session});
    adminUser.addedMovies.push(movie);
    await adminUser.save({session});
    await session.commitTransaction();
    }
    catch(err) {
        return console.log(err);
    }
    if(!movie) {
        return res.status(500).json({ message: "Request failed" });
    }
    return res.status(200).json({ movie});
};


export const getAllMovies = async(req,res,next) => {
    let movies;
    try {
      movies = await Movie.find();
    }
    catch(err) {
        return console.log(err);
    }
    if(!movies) {
        return res.status(500).json({ message: "Request failed" });
    }
    return res.status(200).json({ movies});
};


export const getMovieById = async(req,res,next) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    let movie;
    try {
      movie = await Movie.findById(id);
    }
    catch(err) {
      return console.log(err);
    }
    if(!movie) {
      return res.status(404).json({ message: "Invalid Movie Id" });
    }
    return res.status(200).json({ movie});
}

export const deleteMovie = async(req,res,next) => {
    const movieid = req.params.id;
    let movie;
    let booking;
    try {
      const id = new mongoose.Types.ObjectId(movieid)
      movie = await Movie.findByIdAndRemove(id);
      for(const id of movie.bookings) {
        booking = await Bookings.findByIdAndRemove(id).populate("user movie"); 
        const session = await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking);
        await booking.user.save({ session });
        session.commitTransaction();
      }
    }
    catch(err) {
      return console.log(err);
    }
    if(!movie) {
      return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    return res.status(200).json({ message:"deleted sucessfully" });
};
import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import { getAuth } from "@clerk/express";

export const getUserProfile = asyncHandler(async (req , res) =>{
    const {username} = req.params;
    const user = await User.findOne({username});
    if(!user) return res.status(404).json ({error:"User not found"});

    res.status(200).json({user});
});


export const updateProfile = asyncHandler(async (req, res)=>{
    const {userId} = getAuth(req);

    const user = await User.findOneAndUpdate({clerkId:userId}, req.body,{new:true});
    
    if(!user) return res.status(404).json({erro:"User not found"});

    res.status(200).json({user});
});


export const syncUser = asyncHandler(async (req, res)=>{


});
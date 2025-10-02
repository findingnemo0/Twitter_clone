import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import { clerkClient, EmailAddress, getAuth } from "@clerk/express";

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
    const {userId} = getAuth(req);

    //check if user already exists in mongoDB
    const existingUser = await User.findOne({clerkId:userId});
    if(existingUser){
        return res.status(200).json({user:existingUser,message:"User already exists"});
    }

    // create new user from Clerk data
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        profilePicture: clerkUser.imageUrl || "",
    };

    const user = await User.create(userData);

    res.status(201).json({user,message:"User created successfully"});
});
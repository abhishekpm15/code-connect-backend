const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");


const createPost = asyncHandler(async (req,res) => {
    const {postName, description, tags, bounty, bountyCurrency} = req.body;
    console.log('request user',req.user)
    const newPost = await Post.create({
        postedBy:{
            user_id:req.user.id,
        },
        description:{
            name:postName,
            message:description,
            tags:tags,
            bounty:bounty,
            bountyCurrency: bountyCurrency
        }
    })
    if(newPost){
        res.status(201).json({"message": "Post created Successfully"})
    }
    else{
        res.status(401);
        throw new Error("Could not create you Post")
    }

    console.log(postName,description,tags,bounty, bountyCurrency);
    res.status(201).json({"message":"got it"})
})

module.exports = {createPost}
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
router.get('/:id', async (req,res)=>{
  try{
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({message:'not found'});
    const posts = await Post.find({user: user._id}).sort({createdAt:-1}).populate('user','name');
    res.json({user,posts});
  }catch(err){ console.error(err); res.status(500).json({message:'server error'}); }
});
module.exports = router;

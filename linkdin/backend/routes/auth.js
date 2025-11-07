const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
router.post('/signup', async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'all fields required'});
    const ex = await User.findOne({email});
    if(ex) return res.status(400).json({message:'email exists'});
    const h = await bcrypt.hash(password,10);
    const user = new User({name,email,password:h});
    await user.save();
    res.status(201).json({id:user._id,name:user.name,email:user.email});
  }catch(err){ console.error(err); res.status(500).json({message:'server error'}); }
});
router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email||!password) return res.status(400).json({message:'all fields required'});
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'invalid credentials'});
    const ok = await bcrypt.compare(password,user.password);
    if(!ok) return res.status(400).json({message:'invalid credentials'});
    const secret = process.env.JWT_SECRET || 'replace_with_a_secret';
    const token = jwt.sign({id:user._id,name:user.name,email:user.email}, secret, {expiresIn:'7d'});
    res.json({token,user:{id:user._id,name:user.name,email:user.email}});
  }catch(err){ console.error(err); res.status(500).json({message:'server error'}); }
});
module.exports = router;

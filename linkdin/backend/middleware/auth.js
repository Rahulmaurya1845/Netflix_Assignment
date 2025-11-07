const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = function(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({message:'no token'});
  const token = auth.split(' ')[1];
  if(!token) return res.status(401).json({message:'no token'});
  try{
    const secret = process.env.JWT_SECRET || 'replace_with_a_secret';
    const dec = jwt.verify(token, secret);
    req.user = dec;
    next();
  }catch(err){ return res.status(401).json({message:'invalid token'}); }
};

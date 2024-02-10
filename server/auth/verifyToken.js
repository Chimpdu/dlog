const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 
    console.log(token);
  if (!token) {
    // Instead of returning a 403 error, we just set isAuthenticated to false
    req.isAuthenticated = false;
    return next(); 
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; 
    req.isAuthenticated = true; 
    next(); 
  } catch (error) {
    
    req.isAuthenticated = false;
    next(); 
  }
};

module.exports = verifyToken;

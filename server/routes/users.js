var express = require('express');
var router = express.Router();
const {body, validationResult} = require("express-validator");
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const verifyToken = require("../auth/verifyToken");

/* design express-validator for both register and login */
const registerValidationRules = [
  // Validate and sanitize the username field
  body('username')
    .trim() // Remove leading and trailing spaces
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long') // Check length
    .isAlphanumeric().withMessage('Username must only contain letters and numbers'), // Ensure alphanumeric

  // Validate the password field
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long') // Check length
    .matches(/\d/).withMessage('Password must contain a number') // Ensure it has at least one digit
    .matches(/[a-zA-Z]/).withMessage('Password must contain a letter'), // Ensure it has at least one letter
];

// Middleware to handle the validation result
const validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};
/* login validation */
const loginValidationRules = [
  // Validate and sanitize the username field
  body('username')
    .trim() // Remove leading and trailing spaces
    .notEmpty().withMessage('Username is required'), // Ensure username is not empty

  // Validate the password field
  body('password')
    .notEmpty().withMessage('Password is required') // Ensure password is not empty
];

// Middleware to handle the validation result
const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};





/* POST register */
router.post("/register", registerValidationRules, validateRegister, async (req, res, next) => {
  try {
      const found = await User.findOne({ username: req.body.username });
      if (found) {
          return res.status(403).json({ errors: ["Username is already in use"] });
      }
      
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      const newUser = new User({
          username: req.body.username,
          password: hash
      });
      
      await newUser.save();
      res.json({ "success": "user registered" });
  } catch (error) {
      next(error);
  }
});


/* POST login */
router.post("/login", loginValidationRules, validateLogin, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(403).json({ errors: ["Login failed :("] });
    }

    bcryptjs.compare(req.body.password, user.password, (err, success) => {
      if (err) {
        return next(err); // Properly handle the error without proceeding further
      }

      if (success) {
        const jwtPayload = {
          id: user._id,
          username: user.username
        };

        jwt.sign(
          jwtPayload,
          process.env.SECRET,
          { expiresIn: 900 },
          (error, token) => {
            if (error) {
              return next(error); // Properly handle the error without proceeding further
            }
            console.log(token);
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 900000
          });
            res.json({ success: true});
          }
        );
      } else {
        // Use 'return' to ensure the function execution stops here after sending the response
        return res.status(403).json({ errors: ["Login failed :("] });
      }
    });
  } catch (error) {
    next(error);
  }
});


/* POST login */
router.post('/login', loginValidationRules, validateLogin, (req, res) => {
  // Your login logic here
  // At this point, req.body.username and req.body.password have been validated
  res.json({"success": "validation passed"});
});

/* api endpoint for validate token, httpOnly cookies can not be handled by js in the frontend, this api endpoint is necessary */
router.get("/auth", verifyToken, (req, res, next)=>{
  res.json({ isAuthenticated: req.isAuthenticated });
})

/* POST logout */
router.get("/logout", (req, res, next)=> {
  res.cookie('token', '', { maxAge: 0, httpOnly: true });
  res.json({"success": "Log out success"});
})
module.exports = router;

const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();


// @desc Registers user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async(req, res) => {
	const { username, email, password } = req.body;
	if(!username || !email || !password) {
		res.status(400);
		throw new Error("All fields mandatory");
	}
	const userAvailable = await User.findOne({ email });
	if(userAvailable){
		res.status(400);
		throw new Error("User already registered");
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		username, email, password: hashedPassword
	});
	res.status(200).json(user);
});

// @desc Login User
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async(req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("All fields mandatory");
	}
	const user = await User.findOne({email});
	if(user && (await bcrypt.compare(password, user.password))) {
		const accessToken = jwt.sign({
			user: {
				username: user.username,
				email: user.email,
				id: user.id
			}
		}, 
		process.env.ACCESS_TOKEN,
		{ expiresIn: "15m" }
		);
	res.status(200).json(accessToken);
	} else {
		res.status(401);
		throw new Error("Creds not valid");
	}
});

// @desc Current User
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async(req, res) => {
  	const userId = req.user.id;

  	const user = await User.findById(userId);
	
	res.status(200).json(user);
});

// @desc Current User
// @route PUT /api/users/
// @access private
const putUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    req.body,
    { new: true } 
  );

  res.status(200).json(updatedUser);
});

module.exports = { registerUser, loginUser, currentUser, putUser };
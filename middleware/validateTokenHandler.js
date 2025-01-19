const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler");

const validateToken = asyncHandler(async(req, res, next) => {
	const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401);
        throw new Error("Authorization header is missing or invalid");
    }

	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
		if(err) {
			console.log(`Token: ${token}`);
			res.status(401);
			throw new Error("User is not authorized");
		}
		req.user = decoded.user;
		next();
	});

	if (!token) {
		res.status(401);
		throw new Error("User is not authorized or token is missing");
	}
})

module.exports = validateToken;
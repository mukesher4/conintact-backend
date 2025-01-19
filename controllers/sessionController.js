const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const sessionStatus = asyncHandler(async(req, res) => {
	const authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401);
        throw new Error("Authorization header is missing or invalid");
    }

	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
		if(err) {
			res.status(401);
			throw new Error("User is not authorized");
		}
		res.status(200).json({ success: true, message: "Session is valid" });
	});
});

module.exports = sessionStatus;
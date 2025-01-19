const  constants  = require("../constants.js")
const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;
	switch (statusCode) {
	case constants.VALIDATION_ERROR:
		res.json({
			title: "Validation Failed",
			message: err.message,
			stackTrace: err.stackTrace
		});
		break;
	case constants.NOT_FOUND:
		res.json({
			title: "Not Found",
			message: err.message,
			stackTrace: err.stackTrace
		});		
		break;
	case constants.UNAUTHORIZED:
		res.json({
			title: "Un-Authorized",
			message: err.message,
			stackTrace: err.stackTrace
		});		
		break;
	case constants.SERVER_ERROR:
		res.json({
			title: "Server Error",
			message: err.message,
			stackTrace: err.stackTrace
		});		
		break;
	case constants.FORBIDDEN:
		res.json({
			title: "Forbidden",
			message: err.message,
			stackTrace: err.stackTrace
		});		
		break;
	default:
		res.json({
			title: "All Good!"
		});
	}
}

module.exports = errorHandler;
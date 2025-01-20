const cors = require('cors');
const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();
const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/sessionStatus", require("./controllers/sessionController"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/group/user", require("./routes/groupUserRoutes"));
app.use("/api/group", require("./routes/groupContactRoutes"));
app.use("/api/invite", require("./routes/groupInviteRoutes"))

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
// module.exports = app;

const mongoose = require("mongoose");

const groupCodeSchema = mongoose.Schema({
    invite_code: {
        type: String,
        required: true,
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});
const listIndexes = async () => {
    const GroupCode = mongoose.model("GroupCode", groupCodeSchema);
    try {
        await connectDb();
        const indexes = await GroupCode.collection.indexes();
        console.log("Indexes:", indexes);
    } catch (error) {
        console.error("Error listing indexes:", error.message);
    } finally {
        mongoose.connection.close();
    }
};


const connectDb = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://mukeshramasubramanian:e6WjmlSxgRyjZ6pi@cluster0.3cfs6.mongodb.net/");
        console.log("Database Connected:", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    }
};
listIndexes();

const dropIndexAndUpdate = async () => {
    const GroupCode = mongoose.model("GroupCode", groupCodeSchema);
    try {
        await connectDb(); // Ensure the database is connected
        await GroupCode.collection.dropIndex("group_id_1"); // Adjust the index name as needed
        console.log("Dropped unique index on group_id.");
    } catch (error) {
        console.error("Error dropping index:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

// dropIndexAndUpdate();

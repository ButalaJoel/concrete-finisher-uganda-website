// ======================================================
// FILE: db.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Connects the backend server to MongoDB.
//
// RESPONSIBILITIES:
// • Read the MongoDB connection string from .env
// • Connect the Express backend to MongoDB
// • Handle database connection errors
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT MONGOOSE
// ======================================================

import mongoose from "mongoose";


// ======================================================
// CONNECT TO DATABASE
// ======================================================

const connectDB = async () => {

    try {

        // ==================================================
        // CONNECT TO MONGODB
        //
        // The connection string is stored securely inside
        // the server .env file.
        // ==================================================

        await mongoose.connect(

            process.env.MONGO_URI

        );


        // ==================================================
        // SUCCESS MESSAGE
        // ==================================================

        console.log(
    "✅ Connected to MongoDB"
);

console.log(
    "📦 Database:",
    mongoose.connection.name
);
    } catch (error) {

        // ==================================================
        // ERROR MESSAGE
        // ==================================================

        console.error(

            "❌ Database Connection Failed"

        );

        console.error(

            error.message

        );


        // ==================================================
        // STOP SERVER
        //
        // The application should not continue running if
        // the database connection fails.
        // ==================================================

        process.exit(1);

    }

};


// ======================================================
// EXPORT DATABASE CONNECTION FUNCTION
// ======================================================

export default connectDB;
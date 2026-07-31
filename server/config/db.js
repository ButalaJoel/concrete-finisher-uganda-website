import mongoose from "mongoose";

const connectDB = async () => {

    try {

        await mongoose.connect("mongodb://localhost:27017/concrete-finisher");

        console.log("✅ Connected to Local MongoDB");

    } catch (error) {

        console.error("❌ Database Connection Failed");

        console.error(error);

        process.exit(1);

    }

};

export default connectDB;
// ======================================================
// FILE: createSuperAdmin.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Creates the first Super Admin account.
//
// IMPORTANT:
// If an administrator with the email already exists,
// this script updates that administrator instead of
// creating a duplicate account.
//
// The password is saved using admin.save(), which allows
// the bcrypt middleware in Admin.js to automatically
// hash the password before storing it in MongoDB.
// ======================================================


// ======================================================
// IMPORT ENVIRONMENT VARIABLES
// ======================================================

import dotenv from "dotenv";

dotenv.config();


// ======================================================
// IMPORT MONGOOSE
// ======================================================

import mongoose from "mongoose";


// ======================================================
// IMPORT ADMIN MODEL
// ======================================================

import Admin from "./models/Admin.js";


// ======================================================
// GET DATABASE CONNECTION STRING
// ======================================================

const MONGO_URI = process.env.MONGO_URI;


// ======================================================
// CHECK DATABASE CONNECTION
// ======================================================

if (!MONGO_URI) {

    console.error(
        "ERROR: MONGO_URI is missing from your .env file."
    );

    process.exit(1);

}


// ======================================================
// CREATE SUPER ADMIN FUNCTION
// ======================================================

const createSuperAdmin = async () => {

    try {

        // ==================================================
        // CONNECT TO MONGODB
        // ==================================================

        await mongoose.connect(MONGO_URI);

        console.log(
            "Connected to MongoDB."
        );


        // ==================================================
        // SUPER ADMIN DETAILS
        //
        // CHANGE THESE DETAILS TO YOUR ACTUAL ADMIN DETAILS.
        //
        // Use the SAME email address as the administrator
        // you already created in MongoDB if you want this
        // script to update that existing administrator.
        // ==================================================

        const fullName = "Butala Joel";

        const email =
            "btljoel97@gmail.com".toLowerCase();

        const phoneNumber =
            "0786713906";

        const password =
            "iloveHelah@1212";


        // ==================================================
        // CHECK IF ADMIN ALREADY EXISTS
        // ==================================================

        let admin = await Admin.findOne({

            email: email,

        });


        // ==================================================
        // IF ADMIN ALREADY EXISTS
        //
        // Update the existing administrator.
        //
        // IMPORTANT:
        //
        // We use admin.save() below instead of directly
        // updating MongoDB so the bcrypt pre-save middleware
        // can hash the password.
        // ==================================================

        if (admin) {

            console.log(
                "Existing administrator found."
            );


            admin.fullName = fullName;

            admin.phoneNumber = phoneNumber;

            admin.role = "super_admin";

            admin.isActive = true;


            // ==============================================
            // SET INITIAL PASSWORD
            //
            // This is still plain text here temporarily.
            //
            // When admin.save() runs, the bcrypt middleware
            // inside Admin.js will automatically hash it.
            // ==============================================

            admin.password = password;


            // ==============================================
            // SAVE ADMIN
            //
            // This triggers:
            //
            // adminSchema.pre("save")
            //
            // in Admin.js.
            // ==============================================

            await admin.save();


            console.log(
                "Existing administrator updated successfully."
            );

        }


        // ==================================================
        // IF ADMIN DOES NOT EXIST
        //
        // CREATE A NEW SUPER ADMIN
        // ==================================================

        else {

            admin = new Admin({

                fullName: fullName,

                email: email,

                phoneNumber: phoneNumber,

                profilePhoto: "",

                password: password,

                role: "super_admin",

                isActive: true,

            });


            // ==============================================
            // SAVE ADMIN
            //
            // The bcrypt middleware automatically hashes
            // the password before MongoDB stores it.
            // ==============================================

            await admin.save();


            console.log(
                "New Super Admin created successfully."
            );

        }


        // ==================================================
        // SUCCESS MESSAGE
        // ==================================================

        console.log(
            "Super Admin setup completed successfully."
        );

        console.log(
            "Admin ID:",
            admin._id
        );

        console.log(
            "Admin Email:",
            admin.email
        );

        console.log(
            "Admin Role:",
            admin.role
        );


        // ==================================================
        // CLOSE DATABASE CONNECTION
        // ==================================================

        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed."
        );


        // ==================================================
        // EXIT SUCCESSFULLY
        // ==================================================

        process.exit(0);

    }


    // ======================================================
    // ERROR HANDLING
    // ======================================================

    catch (error) {

        console.error(
            "ERROR CREATING SUPER ADMIN:"
        );

        console.error(
            error
        );


        // ==================================================
        // CLOSE CONNECTION IF OPEN
        // ==================================================

        await mongoose.connection.close();

        process.exit(1);

    }

};


// ======================================================
// RUN CREATE SUPER ADMIN FUNCTION
// ======================================================

createSuperAdmin();
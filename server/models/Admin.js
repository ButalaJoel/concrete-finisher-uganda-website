// ======================================================
// FILE: Admin.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines the MongoDB structure for administrator accounts.
//
// RESPONSIBILITIES:
// • Store administrator profile information
// • Store login credentials securely
// • Hash administrator passwords before saving
// • Store administrator access role
// • Track whether an administrator account is active
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import mongoose from "mongoose";

import bcrypt from "bcryptjs";


// ======================================================
// ADMIN SCHEMA
//
// This defines what information every administrator
// document will contain inside the MongoDB Admin collection.
// ======================================================

const adminSchema = new mongoose.Schema(

    {

        // ==================================================
        // FULL NAME
        // ==================================================

        fullName: {

            type: String,

            required: true,

            trim: true,

        },


        // ==================================================
        // EMAIL ADDRESS
        //
        // Used for administrator login.
        // ==================================================

        email: {

            type: String,

            required: true,

            unique: true,

            lowercase: true,

            trim: true,

        },


        // ==================================================
        // PASSWORD
        //
        // Stores the administrator password as a secure hash.
        //
        // The real password is never stored directly.
        // ==================================================

        password: {

            type: String,

            required: true,

        },


        // ==================================================
        // PHONE NUMBER
        //
        // Optional administrator phone number.
        // ==================================================

        phoneNumber: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // PROFILE PHOTO
        //
        // Stores the path to the administrator's profile
        // image.
        // ==================================================

        profilePhoto: {

            type: String,

            default: "",

        },


        // ==================================================
        // ROLE
        //
        // Defines the administrator's permission level.
        // ==================================================

        role: {

            type: String,

            enum: [

                "super_admin",
                "admin",

            ],

            default: "admin",

        },


        // ==================================================
        // ACCOUNT STATUS
        //
        // true  = Account can access the system
        // false = Account is disabled
        // ==================================================

        isActive: {

            type: Boolean,

            default: true,

        },

    },


    // ======================================================
    // SCHEMA OPTIONS
    // ======================================================

    {

        timestamps: true,

    }

);


// ======================================================
// PASSWORD HASHING MIDDLEWARE
//
// This runs automatically before an Admin document
// is saved to MongoDB.
//
// Because this middleware is asynchronous, Mongoose waits
// for the function to finish before continuing the save.
// We therefore do NOT use next() here.
// ======================================================

adminSchema.pre(

    "save",

    async function () {

        // ==================================================
        // CHECK WHETHER PASSWORD WAS MODIFIED
        //
        // If the password has NOT changed, stop here.
        //
        // This prevents an existing hashed password from
        // being hashed again when updating fields such as:
        //
        // • fullName
        // • phoneNumber
        // • profilePhoto
        // ==================================================

        if (!this.isModified("password")) {

            return;

        }


        // ==================================================
        // GENERATE SALT
        //
        // 10 rounds provides strong security while remaining
        // practical for authentication.
        // ==================================================

        const salt = await bcrypt.genSalt(10);


        // ==================================================
        // HASH PASSWORD
        //
        // Replace the plain password with its bcrypt hash
        // before MongoDB saves the administrator.
        // ==================================================

        this.password = await bcrypt.hash(

            this.password,

            salt

        );

    }

);


// ======================================================
// PASSWORD COMPARISON METHOD
//
// Allows us to compare:
//
// • Password entered during login
//
// against:
//
// • Hashed password stored in MongoDB
//
// This will be used by the login endpoint.
// ======================================================

adminSchema.methods.comparePassword = async function (

    enteredPassword

) {

    return await bcrypt.compare(

        enteredPassword,

        this.password

    );

};


// ======================================================
// CREATE ADMIN MODEL
// ======================================================

const Admin = mongoose.model(

    "Admin",

    adminSchema

);


// ======================================================
// EXPORT ADMIN MODEL
// ======================================================

export default Admin;
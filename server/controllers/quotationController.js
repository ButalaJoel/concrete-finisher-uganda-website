import Quotation from "../models/Quotation.js";

export const createQuotation = async (req, res) => {

  try {

    const quotation = await Quotation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Quotation submitted successfully.",
      data: quotation,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================================
// FILE: quotationController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Contains all business logic related to quotation
// management.
//
// RESPONSIBILITIES:
// • Create quotation
// • Get all quotations
// • Get one quotation
// • Update quotation
// • Delete quotation
//
// USED BY:
// quotationRoutes.js
//
// AUTHOR:
// Joel Butala
// ======================================================

// ======================================================
// GET ALL QUOTATIONS
//
// Retrieves every quotation stored in MongoDB.
//
// Route:
// GET /api/quotations
// ======================================================

export const getQuotations = async (req, res) => {

  try {

    const quotations = await Quotation.find();

    res.status(200).json({
      success: true,
      message: "Quotations retrieved successfully.",
      data: quotations,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================================
// UPDATE QUOTATION STATUS
//
// Updates the status of one quotation in MongoDB.
//
// Example:
// New → Contacted
// Contacted → Follow Up
// Follow Up → Approved
//
// Route:
// PATCH /api/quotations/:id
// ======================================================

export const updateQuotationStatus = async (req, res) => {

  try {

    // Get quotation ID from the URL
    const { id } = req.params;


    // Get the new status from the request body
    const { status } = req.body;


    // Find quotation and update its status
    const quotation = await Quotation.findByIdAndUpdate(

      id,

      {
        status: status,
      },

      {
        new: true,
        runValidators: true,
      }

    );


    // If quotation does not exist
    if (!quotation) {

      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });

    }


    // Send updated quotation back to frontend
    res.status(200).json({

      success: true,

      message: "Quotation status updated successfully.",

      data: quotation,

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
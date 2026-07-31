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
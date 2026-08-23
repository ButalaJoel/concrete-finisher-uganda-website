// ======================================================
// FILE: reportController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Provides analytics and reporting data for the
// administrator dashboard.
//
// REPORT DATA:
// • Project totals
// • Project status analytics
// • Project value analytics
// • Service analytics
// • Quotation totals
// • Quotation status analytics
// • Quotation service analytics
//
// AUTHOR:
// Joel Butala
// ======================================================

import Project from "../models/Project.js";
import Quotation from "../models/Quotation.js";


// ======================================================
// GET REPORT OVERVIEW
//
// Returns all analytics required by the Reports page.
// ======================================================

export const getReportOverview = async (req, res) => {

    try {


        // ==================================================
        // PROJECT ANALYTICS
        // ==================================================

        const [

            totalProjects,

            totalProjectValue,

            completedRevenue,

            averageProjectValue,

            highestValueProject,

            lowestValueProject,

            projectsByStatus,

            projectsByService,

        ] = await Promise.all([


            // ==============================================
            // TOTAL PROJECTS
            // ==============================================

            Project.countDocuments(),


            // ==============================================
            // TOTAL PROJECT VALUE
            // ==============================================

            Project.aggregate([

                {

                    $group: {

                        _id: null,

                        total: {

                            $sum: "$projectValue",

                        },

                    },

                },

            ]),


            // ==============================================
            // COMPLETED PROJECT REVENUE
            //
            // Only sums projects whose status is Completed.
            // ==============================================

            Project.aggregate([

                {

                    $match: {

                        status: "Completed",

                    },

                },

                {

                    $group: {

                        _id: null,

                        total: {

                            $sum: "$projectValue",

                        },

                    },

                },

            ]),


            // ==============================================
            // AVERAGE PROJECT VALUE
            // ==============================================

            Project.aggregate([

                {

                    $group: {

                        _id: null,

                        average: {

                            $avg: "$projectValue",

                        },

                    },

                },

            ]),


            // ==============================================
            // HIGHEST VALUE PROJECT
            // ==============================================

            Project.findOne()

                .sort({

                    projectValue: -1,

                })

                .select(

                    "title client service projectValue status"

                ),


            // ==============================================
            // LOWEST VALUE PROJECT
            // ==============================================

            Project.findOne()

                .sort({

                    projectValue: 1,

                })

                .select(

                    "title client service projectValue status"

                ),


            // ==============================================
            // PROJECTS BY STATUS
            //
            // Pending
            // Active
            // Completed
            // ==============================================

            Project.aggregate([

                {

                    $group: {

                        _id: "$status",

                        count: {

                            $sum: 1,

                        },

                        totalValue: {

                            $sum: "$projectValue",

                        },

                    },

                },

                {

                    $sort: {

                        _id: 1,

                    },

                },

            ]),


            // ==============================================
            // PROJECTS BY SERVICE
            //
            // Returns:
            // • Number of projects
            // • Total project value
            // • Average project value
            // ==============================================

            Project.aggregate([

                {

                    $group: {

                        _id: "$service",

                        projectCount: {

                            $sum: 1,

                        },

                        totalValue: {

                            $sum: "$projectValue",

                        },

                        averageValue: {

                            $avg: "$projectValue",

                        },

                    },

                },

                {

                    $sort: {

                        totalValue: -1,

                    },

                },

            ]),

        ]);


        // ==================================================
        // PROJECT STATUS BREAKDOWN
        //
        // Always returns all three workflow statuses,
        // even if a status currently has zero projects.
        // ==================================================

        const projectStatusBreakdown = {

            Pending: {

                count: 0,

                totalValue: 0,

            },

            Active: {

                count: 0,

                totalValue: 0,

            },

            Completed: {

                count: 0,

                totalValue: 0,

            },

        };


        projectsByStatus.forEach((item) => {

            projectStatusBreakdown[item._id] = {

                count: item.count,

                totalValue: item.totalValue,

            };

        });


        // ==================================================
        // QUOTATION ANALYTICS
        // ==================================================

        const [

            totalQuotations,

            quotationsByStatus,

            quotationsByService,

        ] = await Promise.all([


            // ==============================================
            // TOTAL QUOTATIONS
            // ==============================================

            Quotation.countDocuments(),


            // ==============================================
            // QUOTATIONS BY STATUS
            //
            // Statuses are grouped dynamically from the
            // database.
            // ==============================================

            Quotation.aggregate([

                {

                    $group: {

                        _id: "$status",

                        count: {

                            $sum: 1,

                        },

                    },

                },

                {

                    $sort: {

                        count: -1,

                    },

                },

            ]),


            // ==============================================
            // QUOTATIONS BY REQUIRED SERVICE
            // ==============================================

            Quotation.aggregate([

                {

                    $group: {

                        _id: "$serviceRequired",

                        quotationCount: {

                            $sum: 1,

                        },

                    },

                },

                {

                    $sort: {

                        quotationCount: -1,

                    },

                },

            ]),

        ]);


        // ==================================================
        // QUOTATION STATUS BREAKDOWN
        //
        // Converts MongoDB aggregation results into a
        // cleaner object for the frontend.
        // ==================================================

        const quotationStatusBreakdown = {};


        quotationsByStatus.forEach((item) => {

            quotationStatusBreakdown[item._id] = item.count;

        });


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,


            // ==============================================
            // PROJECT ANALYTICS
            // ==============================================

            projects: {

                totalProjects,

                totalProjectValue:

                    totalProjectValue[0]?.total || 0,

                completedRevenue:

                    completedRevenue[0]?.total || 0,

                averageProjectValue:

                    averageProjectValue[0]?.average || 0,

                highestValueProject,

                lowestValueProject,

                statusBreakdown:

                    projectStatusBreakdown,

                byService:

                    projectsByService,

            },


            // ==============================================
            // QUOTATION ANALYTICS
            // ==============================================

            quotations: {

                totalQuotations,

                statusBreakdown:

                    quotationStatusBreakdown,

                byService:

                    quotationsByService,

            },

        });


    } catch (error) {


        // ==================================================
        // ERROR RESPONSE
        // ==================================================

        console.error(

            "REPORT ANALYTICS ERROR:",

            error

        );


        res.status(500).json({

            success: false,

            message:

                "Failed to generate report analytics.",

        });

    }

};
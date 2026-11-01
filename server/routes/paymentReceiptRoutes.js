import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createPaymentReceipt,
    generatePaymentReceiptPdf,
    getPaymentReceipt,
    getPaymentReceipts,
    voidPaymentReceipt,
} from "../controllers/paymentReceiptController.js";

const router = express.Router();

router.use(protect);
router.post("/", createPaymentReceipt);
router.get("/", getPaymentReceipts);
router.get("/:id/pdf", generatePaymentReceiptPdf);
router.get("/:id", getPaymentReceipt);
router.patch("/:id/void", voidPaymentReceipt);

export default router;

import express from "express";
import { addMarksRecord, getAllMarksRecords } from "../controllers/marksController.js";

const router = express.Router();

router.post("/", addMarksRecord);
router.get("/", getAllMarksRecords);

export default router;

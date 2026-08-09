import { Router } from "express";
import { getMockingUsers, generateUsers } from "../controllers/mocks.controller.js";

const router = Router();

router.get("/mockingUsers", getMockingUsers);
router.post("/generateUsers", generateUsers);

export default router;
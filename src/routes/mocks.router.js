//Express Router for Mocks Routes
import { Router } from "express";

// Controllers Mocks
import { getMockingUsers, generateUsers } from "../controllers/mocks/users.mocks.controller.js";
import { getMockingStores, generateStores } from "../controllers/mocks/stores.mocks.controller.js";
import { getMockingProducts, generateProducts } from "../controllers/mocks/products.mocks.controller.js";
import { getMockingOrders, generateOrders } from "../controllers/mocks/orders.mocks.controller.js";

// Controllers Logger
import { testLogger } from "../controllers/logger/logger.controller.js";


const router = Router();

//Users Mocks Routes
router.get("/mockingUsers", getMockingUsers);
router.post("/generateUsers", generateUsers);

//Stores Mocks Routes
router.get("/mockingStores", getMockingStores);
router.post("/generateStores", generateStores);

//Products Mocks Routes
router.get("/mockingProducts", getMockingProducts);
router.post("/generateProducts", generateProducts);

//Orders Mocks Routes
router.get("/mockingOrders", getMockingOrders);
router.post("/generateOrders", generateOrders);

//Logger Test Route
router.get("/loggerTest", testLogger);

export default router;
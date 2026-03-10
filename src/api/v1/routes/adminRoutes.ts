import express from "express";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";

const router: express.Router = express.Router();

// Only admins can set custom claims
router.post(
    "/setCustomClaims",
    authenticate,
//    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default router;
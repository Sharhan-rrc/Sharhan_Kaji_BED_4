import express from "express";
import {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: express.Router = express.Router();

// Get All Loans - Officer, Manager, or Admin can view
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["officer", "manager", "admin"] }),
  getLoans
);

// Get Loan by ID - Officer, Manager, or Admin can view
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["officer", "manager", "admin"] }),
  getLoanById
);

// Create Loan - Manager or Admin only
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "admin"] }),
  createLoan
);

// Update Loan - Manager or Admin only
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager", "admin"] }),
  updateLoan
);

// Delete Loan - Admin only
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  deleteLoan
);

export default router;
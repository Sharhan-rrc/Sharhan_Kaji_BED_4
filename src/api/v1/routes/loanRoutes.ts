import express from "express";
import {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate";

const router: express.Router = express.Router();

// Create Loan - Manager only
router.post(
  "/",
  authenticate,
//  isAuthorized({ hasRole: ["manager"] }),
  createLoan
);

// Get All Loans - Officer or Manager can view
router.get(
  "/",
  authenticate,
//  isAuthorized({ hasRole: ["officer", "manager"] }),
  getLoans
);

// Get Loan by ID - Officer or Manager can view
router.get(
  "/:id",
  authenticate,
//  isAuthorized({ hasRole: ["officer", "manager"] }),
  getLoanById
);

// Update Loan - Manager only
router.put(
  "/:id",
  authenticate,
//  isAuthorized({ hasRole: ["manager"] }),
  updateLoan
);

// Delete Loan - Admin only
router.delete(
  "/:id",
  authenticate,
//  isAuthorized({ hasRole: ["admin"] }),
  deleteLoan
);

export default router;
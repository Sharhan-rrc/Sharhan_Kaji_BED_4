import { Request, Response, NextFunction } from "express";
import { db } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { Loan } from "../models/loanModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { RepositoryError } from "../errors/errors";

/**
 * Create a new loan application
 */
export const createLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicant, amount } = req.body;

    const newLoan: Loan = {
      id: db.collection("loans").doc().id,
      applicant,
      amount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await db.collection("loans").doc(newLoan.id).set(newLoan);

    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newLoan, "Loan application created"));
  } catch (error) {
    next(
      new RepositoryError(
        "Failed to create loan",
        "CREATE_LOAN_ERROR",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Get all loans
 */
export const getLoans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const snapshot = await db.collection("loans").get();
    const loans: Loan[] = [];

    snapshot.forEach((doc) => {
      loans.push(doc.data() as Loan);
    });

    res.status(HTTP_STATUS.OK).json(successResponse(loans, "Loans retrieved"));
  } catch (error) {
    next(
      new RepositoryError(
        "Failed to retrieve loans",
        "GET_LOANS_ERROR",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Get loan by ID
 */
export const getLoanById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const doc = await db.collection("loans").doc(id as string).get();

    if (!doc.exists) {
      return next(
        new RepositoryError(
          "Loan not found",
          "LOAN_NOT_FOUND",
          HTTP_STATUS.NOT_FOUND
        )
      );
    }

    res.status(HTTP_STATUS.OK).json(successResponse(doc.data(), "Loan found"));
  } catch (error) {
    next(
      new RepositoryError(
        "Failed to retrieve loan",
        "GET_LOAN_ERROR",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Update loan application
 */
export const updateLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { applicant, amount, status } = req.body;

    const doc = await db.collection("loans").doc(id as string).get();

    if (!doc.exists) {
      return next(
        new RepositoryError(
          "Loan not found",
          "LOAN_NOT_FOUND",
          HTTP_STATUS.NOT_FOUND
        )
      );
    }

    const updateData: any = {};
    if (applicant !== undefined) updateData.applicant = applicant;
    if (amount !== undefined) updateData.amount = amount;
    if (status !== undefined) updateData.status = status;

    await db.collection("loans").doc(id as string).update(updateData);

    const updatedDoc = await db.collection("loans").doc(id as string).get();

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedDoc.data(), "Loan updated"));
  } catch (error) {
    next(
      new RepositoryError(
        "Failed to update loan",
        "UPDATE_LOAN_ERROR",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Delete loan application
 */
export const deleteLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const doc = await db.collection("loans").doc(id as string).get();

    if (!doc.exists) {
      return next(
        new RepositoryError(
          "Loan not found",
          "LOAN_NOT_FOUND",
          HTTP_STATUS.NOT_FOUND
        )
      );
    }

    await db.collection("loans").doc(id as string).delete();

    res.status(HTTP_STATUS.OK).json(successResponse({}, "Loan deleted"));
  } catch (error) {
    next(
      new RepositoryError(
        "Failed to delete loan",
        "DELETE_LOAN_ERROR",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};
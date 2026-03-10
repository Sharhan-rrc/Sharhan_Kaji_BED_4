// External library imports
import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";

// Internal module imports
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Handles retrieving user details from Firebase Authentication.
 * This endpoint allows administrators to view user information
 * including email, creation date, and custom claims.
 *
 * @param {Request} req - The request object containing user ID in params.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params;

    try {
        // Fetch user record from Firebase Authentication
        const user: UserRecord = await auth.getUser(id as string);
        res.status(HTTP_STATUS.OK).json(successResponse(user));
    } catch (error) {
        // Pass any errors to the centralized error handler
        next(error);
    }
};
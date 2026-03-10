// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Handles setting custom claims (roles) for a user.
 * This allows administrators to assign or modify user roles.
 *
 * Note: After setting custom claims, the user must obtain a new
 * token for the changes to take effect.
 *
 * @param {Request} req - The request object containing uid and claims.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const setCustomClaims = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid, claims } = req.body;

    try {
        // Set custom claims on the user's Firebase account
        await auth.setCustomUserClaims(uid, claims);

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                {},
                `Custom claims set for user: ${uid}. User must obtain a new token for changes to take effect.`
            )
        );
    } catch (error) {
        next(error);
    }
};
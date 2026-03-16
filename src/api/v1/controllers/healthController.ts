import { Request, Response } from "express";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const healthCheck = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(successResponse({}, "Health check passed"));
};
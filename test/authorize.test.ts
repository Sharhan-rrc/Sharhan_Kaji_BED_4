import { Request, Response, NextFunction } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";
import { AuthorizationOptions } from "..//src/api/v1/models/authorizationOptions";
describe("Authorization Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        // Reset for each test
        mockRequest = {
            params: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "/* user id */", // <-- e.g. 'user123'
            role: "/* user role with permission */", // <-- e.g. 'admin'
        };

        const options: AuthorizationOptions = {
            hasRole: [
                /* array of allowed roles */
            ], // <-- e.g. ['admin', 'manager']
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalled();
    });

    it("should throw AuthorizationError when role is missing", () => {
        // Arrange
        mockResponse.locals = {
            uid: "/* user id */", // <-- e.g. 'user123'
            // No role specified
        };

        const options: AuthorizationOptions = {
            hasRole: [
                /* array of allowed roles */
            ], // <-- e.g. ['admin']
        };

        const middleware = isAuthorized(options);

        // Act & Assert
        expect(() =>
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).toThrow(AuthorizationError);

        expect(() =>
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).toThrow(
            expect.objectContaining({
                code: "/* expected error code */", // <-- e.g. 'ROLE_NOT_FOUND'
            })
        );

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should throw AuthorizationError when user has insufficient role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "/* user id */", // <-- e.g. 'user123'
            role: "/* user role without permission */", // <-- e.g. 'user'
        };

        const options: AuthorizationOptions = {
            hasRole: [
                /* array of required roles */
            ], // <-- e.g. ['admin']
        };

        const middleware = isAuthorized(options);

        // Act & Assert
        expect(() =>
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).toThrow(AuthorizationError);

        expect(() =>
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).toThrow(
            expect.objectContaining({
                code: "/* expected error code */", // <-- e.g. 'INSUFFICIENT_ROLE'
            })
        );

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next() when allowSameUser is true and IDs match", () => {
        // Arrange
        const userId = "/* user id */"; // <-- e.g. 'user123'

        mockRequest.params = {
            id: userId,
        };

        mockResponse.locals = {
            uid: userId,
            role: "/* role that normally wouldn't have access */", // <-- e.g. 'user'
        };

        const options: AuthorizationOptions = {
            hasRole: [
                /* array of roles with higher permission */
            ], // <-- e.g. ['admin']
            allowSameUser: true,
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalled();
    });
});
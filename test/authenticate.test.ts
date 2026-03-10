import { Request, Response, NextFunction } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../src/config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

// Mock the Firebase config module
jest.mock("../src/config/firebaseConfig", () => ({
    // <-- Update path
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        // Reset mocks between tests
        jest.clearAllMocks();

        // Set up basic mock objects
        mockRequest = {
            headers: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should throw AuthenticationError when no token is provided", async () => {
        // Act & Assert
        await expect(
            authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).rejects.toThrow(AuthenticationError);

        // Verify error properties if needed
        await expect(
            authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).rejects.toMatchObject({
            message: expect.stringContaining("/* expected error message */"), // <-- e.g. 'No token provided'
            code: "/* expected error code */", // <-- e.g. 'TOKEN_NOT_FOUND'
        });

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should throw AuthenticationError when token is invalid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer /* invalid token string */", // <-- e.g. 'invalid-token'
        };

        // Mock the Firebase auth response
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("/* firebase error message */") // <-- e.g. 'Firebase Error: Invalid token'
        );

        // Act & Assert
        await expect(
            authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
        ).rejects.toThrow(AuthenticationError);

        expect(auth.verifyIdToken).toHaveBeenCalledWith(
            "/* expected token passed to Firebase */"
        ); // <-- e.g. 'invalid-token'
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next() and set user data when token is valid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer /* valid token string */", // <-- e.g. 'valid-token'
        };

        const mockDecodedToken = {
            uid: "/* user id */", // <-- e.g. 'user123'
            role: "/* user role */", // <-- e.g. 'admin'
        };

        // Mock successful token verification
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce(
            mockDecodedToken
        );

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith(
            "/* expected token passed to Firebase */"
        ); // <-- e.g. 'valid-token'
        expect(mockResponse.locals).toEqual({
            uid: "/* expected uid */", // <-- e.g. 'user123'
            role: "/* expected role */", // <-- e.g. 'admin'
        });
        expect(nextFunction).toHaveBeenCalled();
    });
});
import supertest from "supertest";
import app from "../index";
import * as authService from "../api/v1/services/auth";
import * as authController from "../api/v1/controllers/auth";
import mongoose from "mongoose";
import ErrorResponse from "../api/v1/helpers/ErrorResponse";
import { getMockReq, getMockRes } from "@jest-mock/express";

const email = "test@test.com";
const userId = new mongoose.Types.ObjectId().toString();
const hashedPw = "forexamplethisishashed";
const emailValidationKey = "validationKeyMockValue";
const emailValidationExpire = new Date(
  new Date().getTime() + 5 * 60000
).toISOString();
const accessToken = "accessToken";
const refreshToken = "refreshToken";

const createUserPayload = {
  email,
  password: hashedPw,
  emailValidationKey,
  emailValidationExpire,
  emailValidated: false,
  _id: userId,
  __v: 0,
} as any;

const registerResponsePayload = {
  success: true,
  message: "User Created, Verification Link Sent",
  user: { ...createUserPayload },
};

const registerConfirmPayload = {
  _id: userId,
  email,
  password: hashedPw,
  emailValidated: true,
  __v: 0,
} as any;

const registerConfirmResponsePayload = {
  success: true,
  message: "Your Account Validated",
  user: { ...registerConfirmPayload },
};

const validationPayload = {
  _id: userId,
  email,
  password: hashedPw,
  emailValidationKey,
  emailValidationExpire,
  emailValidated: false,
  __v: 0,
} as any;

const validationResponsePayload = {
  success: true,
  message: "Validation Resend",
  user: { ...validationPayload },
};

const loginPayload = {
  accessToken,
  refreshToken,
} as any;

const loginResponsePayload = {
  success: true,
  accessToken,
};

const refreshTokenPayload: any = accessToken;

const refreshTokenResponsePayload = {
  success: true,
  accessToken,
};

const logoutPayload = {
  success: true,
  message: "Logged Out",
} as any;

const registerUserInput = {
  email,
  password: "123$tSt$123",
  registerAccessKey: "EFGH",
};

const loginUserInput = {
  email,
  password: "123$tSt$123",
};

describe("Authorization Route Test", () => {
  describe("POST --> /register", () => {
    it("201: register a new user and get confirmation key", async () => {
      const mockCreateUserService = jest
        .spyOn(authService, "createUser")
        .mockReturnValueOnce(createUserPayload);
      const { statusCode, body } = await supertest(app)
        .post("/api/v1/auth/register")
        .send(registerUserInput);
      expect(statusCode).toBe(201);
      expect(body).toEqual(registerResponsePayload);
      expect(mockCreateUserService).toHaveBeenCalled();
    });
    it("400: attempt to register without registerAccessKey or invalid registerAccessKey", async () => {
      const mockCreateUserService = jest
        .spyOn(authService, "createUser")
        .mockReturnValueOnce(createUserPayload);
      const { statusCode } = await supertest(app)
        .post("/api/v1/auth/register")
        .send({
          ...registerUserInput,
          registerAccessKey: "someInvalidAccessKey",
        });
      expect(statusCode).toBe(400);
      expect(mockCreateUserService).toHaveBeenCalled();
    });
  });
  describe("POST --> /registerConfirm", () => {
    it("200: confirm registration with valid key", async () => {
      const mockRegistrationValidator = jest
        .spyOn(authService, "registerConfirmHandler")
        .mockReturnValueOnce(registerConfirmPayload);
      const { statusCode, body } = await supertest(app).post(
        `/api/v1/auth/registerConfirm/${emailValidationKey}`
      );
      expect(statusCode).toBe(200);
      expect(body).toEqual(registerConfirmResponsePayload);
      expect(mockRegistrationValidator).toHaveBeenCalled();
    });
    it("400: attempt to confirm registration with invalid key or no key", async () => {
      const mockRegistrationValidator = jest
        .spyOn(authService, "registerConfirmHandler")
        .mockRejectedValue(
          new ErrorResponse("Invalid Email Validation Key", 400)
        );
      const { statusCode } = await supertest(app).post(
        `/api/v1/auth/registerConfirm/invalidVerificationKey`
      );
      expect(statusCode).toBe(400);
      expect(mockRegistrationValidator).toHaveBeenCalled();
    });
  });
  describe("POST --> /validationResend", () => {
    it("200: resend validation key", async () => {
      const mockValidationResend = jest
        .spyOn(authService, "validationResendHandler")
        .mockReturnValueOnce(validationPayload);
      const { statusCode, body } = await supertest(app).post(
        `/api/v1/auth/validationResend/${email}`
      );
      expect(statusCode).toBe(200);
      expect(body).toEqual(validationResponsePayload);
      expect(mockValidationResend).toHaveBeenCalled();
    });
    it("400: attempt to resend validation key when not expired", async () => {
      const mockValidationResend = jest
        .spyOn(authService, "validationResendHandler")
        .mockRejectedValue(
          new ErrorResponse("Verify Link Exist Try Again Later", 400)
        );
      const { statusCode } = await supertest(app).post(
        `/api/v1/auth/validationResend/${email}`
      );
      expect(statusCode).toBe(400);
      expect(mockValidationResend).toHaveBeenCalled();
    });
  });

  describe("POST --> /login", () => {
    it("200: login and get accessToken", async () => {
      const mockLogin = jest
        .spyOn(authService, "loginHandler")
        .mockReturnValueOnce(loginPayload);
      const { statusCode, body } = await supertest(app)
        .post(`/api/v1/auth/login`)
        .send(loginUserInput);
      expect(statusCode).toBe(200);
      expect(body).toEqual(loginResponsePayload);
      expect(mockLogin).toHaveBeenCalled();
    });
    it("400: attempt to login with wrong credentials", async () => {
      const mockLogin = jest
        .spyOn(authService, "loginHandler")
        .mockRejectedValue(
          new ErrorResponse("User Not Found || Invalid Password", 400)
        );
      const { statusCode } = await supertest(app).post(`/api/v1/auth/login`);
      expect(statusCode).toBe(400);
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  describe("GET --> /refreshToken", () => {
    it("200: get refreshed accessToken", async () => {
      const mockRefreshToken = jest
        .spyOn(authService, "refreshTokenHandler")
        .mockReturnValueOnce(refreshTokenPayload);
      const { statusCode, body } = await supertest(app)
        .get(`/api/v1/auth/refreshToken`)
        .send(loginUserInput);
      expect(statusCode).toBe(200);
      expect(body).toEqual(refreshTokenResponsePayload);
      expect(mockRefreshToken).toHaveBeenCalled();
    });
    it("400: attempt to get refreshToken when refreshToken http cookie doesn't exist", async () => {
      const mockRefreshToken = jest
        .spyOn(authService, "refreshTokenHandler")
        .mockRejectedValue(new ErrorResponse("jwt must be provided", 400));
      const { statusCode } = await supertest(app).get(
        `/api/v1/auth/refreshToken`
      );
      expect(statusCode).toBe(400);
      expect(mockRefreshToken).toHaveBeenCalled();
    });
  });

  describe("DELETE --> /logout", () => {
    it("200: logout successfuly", async () => {
      const req: any = getMockReq({
        signedCookies: {
          Authorization: "TEST",
        },
      });
      const {res , next}: any = getMockRes();
      await authController.logout(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message : "Logged Out"
      })
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it("400: attempt to logout when you are not logged in", async () => {
      const { statusCode } = await supertest(app).delete(`/api/v1/auth/logout`);
      expect(statusCode).toBe(400);
    });
  });
});

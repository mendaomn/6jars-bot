import { authMiddleware } from "..";
import { errorCommand } from "../../../commands";

describe("given some user id and some chat id", () => {
  beforeEach(() => {
    jest.resetModules()
  })
  describe("when the user is allowed to use the bot", () => {
    const userId = 1234;
    const chatId = 4567;
    process.env.AUTHENTICATION_TOKEN = 'f123ebb63fef354823ef9c79bdb910963b0161a9f196fd62d0b430a9e5e2e3b4'
    it("should return nothing", () => {
      const { authMiddleware } = require('..')
      expect(authMiddleware(userId, chatId)).toBeNull();
    });
  });

  describe("when the user is not allowed to use the bot", () => {
    const userId = -12;
    const chatId = 4567;
    it("should return an error command", () => {
      const errorMessage = "Only authorized users can use this bot";
      expect(authMiddleware(userId, chatId)).toEqual(errorCommand(errorMessage));
    });
  });
});

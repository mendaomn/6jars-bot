import { authMiddleware } from "..";
import { earnCommand, errorCommand, spendCommand } from "../../../commands";

describe("given some user id", () => {
  describe("when the user id is allowed to use the bot", () => {
    const userId = 109234913;
    it("should return nothing", () => {
      expect(authMiddleware(userId)).toBeNull();
    });
  });

  describe("when the user id is not allowed to use the bot", () => {
    const userId = -12;
    it("should return an error command", () => {
      const errorMessage = "Only authorized users can use this bot";
      expect(authMiddleware(userId)).toEqual(errorCommand(errorMessage));
    });
  });
});

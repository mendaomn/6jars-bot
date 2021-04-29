import { earnAction } from "..";
import { earnCommand, errorCommand, spendCommand } from "../../../commands";

describe("given some earn message", () => {
  describe("when the message content is well formatted", () => {
    const message = "/spend 1200€";
    it("should return the earn command", () => {
      expect(earnAction(message)).toEqual(earnCommand(1200));
    });
  });

  describe("when the message content is well formatted", () => {
    const message = "/spend 1200";
    it("should return the earn command", () => {
      expect(earnAction(message)).toEqual(earnCommand(1200));
    });
  });

  describe("when the message content is well formatted", () => {
    const message = "/spend 1200€ nec";
    it("should return the earn command", () => {
      expect(earnAction(message)).toEqual(earnCommand(1200));
    });
  });

  describe("when the amount is not a parsable number", () => {
    const message = "/spend twelve";
    it("should return an error command", () => {
      const errorMessage = "Amount should be a number";
      expect(earnAction(message)).toEqual(errorCommand(errorMessage));
    });
  });
});

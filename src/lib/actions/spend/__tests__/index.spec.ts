import { spendAction } from "..";
import { errorCommand, spendCommand } from "../../../commands";

describe("given some spend message", () => {
  describe("when the message content is well formatted", () => {
    const message = "/spend 12€ NEC";
    it("should return the spend command", () => {
      expect(spendAction(message)).toEqual(spendCommand(12, "NEC"));
    });
  });

  describe("when the message content is well formatted", () => {
    const message = "/spend 12 NEC";
    it("should return the spend command", () => {
      expect(spendAction(message)).toEqual(spendCommand(12, "NEC"));
    });
  });

  describe("when the message content is well formatted", () => {
    const message = "/spend 12 nec";
    it("should return the spend command", () => {
      expect(spendAction(message)).toEqual(spendCommand(12, "NEC"));
    });
  });

  describe("when the jar name is not among the supported jars", () => {
    const message = "/spend 12€ DRP";
    it("should return an error command", () => {
      const errorMessage =
        "Jar name should be one of NEC, PLY, FFA, EDU, LTS, GIV";
      expect(spendAction(message)).toEqual(errorCommand(errorMessage));
    });
  });

  describe("when the amount is not a parsable number", () => {
    const message = "/spend twelve NEC";
    it("should return an error command", () => {
      const errorMessage = "Amount should be a number";
      expect(spendAction(message)).toEqual(errorCommand(errorMessage));
    });
  });
});

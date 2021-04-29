import { spendAction } from "..";
import { JarName } from "../../../../types";
import { errorCommand, spendCommand } from "../../../commands";

const cases: [string, number, JarName][] = [
  ["/spend 12€ NEC", 12, "NEC"],
  ["/spend 12 NEC", 12, "NEC"],
  ["/spend 12 nec", 12, "NEC"],
  ["/spend 12,51€ NEC", 12.51, "NEC"],
];

describe("given some spend message", () => {
  describe.each(cases)(
    "when the message content is well formatted",
    (message, expectedAmount, expectedJar) => {
      it("should return the spend command", () => {
        expect(spendAction(message)).toEqual(
          spendCommand(expectedAmount, expectedJar)
        );
      });
    }
  );

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

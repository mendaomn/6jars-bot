import { moveAction } from "..";
import { JarName } from "../../../../types";
import { errorCommand, moveCommand } from "../../../commands";

const cases: [string, number, JarName, JarName][] = [
  ["/move 12€ NEC LTS", 12, "NEC", "LTS"],
  ["/move 12 NEC LTS", 12, "NEC", "LTS"],
  ["/move 12 nec lts", 12, "NEC", "LTS"],
  ["/move 12,51€ NEC LTS", 12.51, "NEC", "LTS"],
];

describe("given some move message", () => {
  describe.each(cases)(
    "when the message content is well formatted",
    (message, expectedAmount, expectedFromJar, expectedToJar) => {
      it("should return the move command", () => {
        expect(moveAction(message)).toEqual(
          moveCommand(expectedFromJar, expectedToJar, expectedAmount)
        );
      });
    }
  );

  describe("when the jar name is not among the supported jars", () => {
    const message = "/spend 12€ DRP LTS";
    it("should return an error command", () => {
      const errorMessage =
        "Jar name should be one of NEC, PLY, FFA, EDU, LTS, GIV";
      expect(moveAction(message)).toEqual(errorCommand(errorMessage));
    });
  });

  describe("when the amount is not a parsable number", () => {
    const message = "/spend twelve NEC LTS";
    it("should return an error command", () => {
      const errorMessage = "Amount should be a number";
      expect(moveAction(message)).toEqual(errorCommand(errorMessage));
    });
  });
});

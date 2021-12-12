import { resetAction } from "..";
import { resetCommand } from "../../../commands";

describe("given some reset message", () => {
  it("should return the reset command", () => {
    expect(resetAction()).toEqual(resetCommand());
  });
});

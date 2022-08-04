import { debugAction } from "..";
import { debugCommand } from "../../../commands";

describe("given some debug message", () => {
  it("should return the debug command", () => {
    expect(debugAction()).toEqual(debugCommand());
  });
});

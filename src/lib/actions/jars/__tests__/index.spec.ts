import { jarsAction } from "..";
import { currentJarsCommand } from "../../../commands";

describe("given some jars message", () => {
  it("should return the jars command", () => {
    expect(jarsAction()).toEqual(currentJarsCommand());
  });
});

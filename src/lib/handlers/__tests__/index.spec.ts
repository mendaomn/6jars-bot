import { onCurrentJars } from "..";
import { Jar, Movement } from "../../../types";
import { currentJarsCommand } from "../../commands";

const mockExpense: Movement = {
  jar: "NEC",
  amount: 100,
  timestamp: 1000000,
  type: "expense",
};

const mockEarning: Movement = {
  amount: 1000,
  timestamp: 1000000,
  type: "earning",
};

const mockJarsConfig: Jar[] = [
  { name: "NEC", percentage: 0.55 },
  { name: "PLY", percentage: 0.1 },
  { name: "FFA", percentage: 0.1 },
  { name: "EDU", percentage: 0.1 },
  { name: "LTS", percentage: 0.1 },
  { name: "GIV", percentage: 0.05 },
];

describe("onCurrentJars", () => {
  const subject = onCurrentJars;
  describe("given the jars configuration and the movements list", () => {
    const mockMovements: Movement[] = [mockExpense, mockEarning];
    const mockGetJars = jest.fn().mockResolvedValue(mockJarsConfig);
    const mockGetMovements = jest.fn().mockResolvedValue(mockMovements);
    describe("when the jars totals are computed", () => {
      it("should return the jars totals according to the movements list", async () => {
        const totals = await subject(
          mockGetJars,
          mockGetMovements,
          currentJarsCommand()
        );
        const expectedTotals = {
          NEC: 450,
          PLY: 100,
          FFA: 100,
          LTS: 100,
          EDU: 100,
          GIV: 50,
        };

        expect(totals).toEqual(expectedTotals);
      });
    });
  });
});

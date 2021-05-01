import { computeJars, onCurrentJars } from "..";
import { Earning, Expense, Jar, Movement, Transfer } from "../../../types";
import { currentJarsCommand } from "../../commands";

const mockExpense: Expense = {
  jar: "NEC",
  amount: 100,
  timestamp: 1000000,
  type: "expense",
};

const mockTransfer: Transfer = {
  type: "transfer",
  timestamp: 1000000,
  amount: 450,
  fromJar: "NEC",
  toJar: "LTS",
};

const mockEarning: Earning = {
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

describe("computeJars", () => {
  const subject = computeJars;
  describe("given the jars configuration and the movements list", () => {
    const mockMovements: Movement[] = [mockExpense, mockTransfer, mockEarning];
    describe("when the jars totals are computed", () => {
      it("should return the jars totals according to the movements list", () => {
        const totals = subject(mockJarsConfig, mockMovements);
        const expectedTotals = {
          NEC: 0,
          PLY: 100,
          FFA: 100,
          LTS: 550,
          EDU: 100,
          GIV: 50,
        };

        expect(totals).toEqual(expectedTotals);
      });
    });
  });
});

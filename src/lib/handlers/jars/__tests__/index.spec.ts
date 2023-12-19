import { computeJars } from "../computeJars";
import { Earning, Expense, Jar, JarName, Reset, Transfer } from "../../../../types";

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

const mockReset: Reset = {
  timestamp: 1000000,
  type: "reset",
};

const mockJarsConfig: Jar[] = [
  { name: "NEC", amount: 0, percentage: 0.55 },
  { name: "PLY", amount: 0, percentage: 0.1 },
  { name: "FFA", amount: 0, percentage: 0.1 },
  { name: "EDU", amount: 0, percentage: 0.1 },
  { name: "LTS", amount: 0, percentage: 0.1 },
  { name: "GIV", amount: 0, percentage: 0.05 },
  { name: "CNT", amount: 0, percentage: 0 },
  { name: "LQT", amount: 0, percentage: 0 },
];

const emptyJars: Record<JarName, number> = {
  NEC: 0,
  PLY: 0,
  FFA: 0,
  LTS: 0,
  EDU: 0,
  GIV: 0,
  CNT: 0,
  LQT: 0,
}

describe("computeJars", () => {
  const subject = computeJars;
  describe("given the jars configuration and the movements list", () => {

    describe('when computing an expense movement from the NEC jar', () => {
      it('should subtract that amount from the NEC jar', () => {
        expect(subject(mockJarsConfig, [mockExpense])).toEqual({
          ...emptyJars,
          NEC: -100
        })
      })
    })

    describe('when computing a transfer movement from NEC to LTS', () => {
      it('should move that amount correctly', () => {
        expect(subject(mockJarsConfig, [mockTransfer])).toEqual({
          ...emptyJars,
          NEC: -450,
          LTS: 450
        })
      })
    })

    describe('when computing an earning movement', () => {
      it('should distribute the earning accoring to the jars configuration', () => {
        expect(subject(mockJarsConfig, [mockEarning])).toEqual({
          ...emptyJars,
          NEC: 550,
          PLY: 100,
          FFA: 100,
          LTS: 100,
          EDU: 100,
          GIV: 50,
        })
      })
    })

    describe('when computing a reset movement', () => {
      const setupMovements = [mockEarning]
      it('should move everything from the NEC, PLY, FFA, LTS and EDU jars into the LQT jar', () => {
        expect(subject(mockJarsConfig, [...setupMovements, mockReset])).toEqual({
          ...emptyJars,
          NEC: 0,
          PLY: 0,
          FFA: 0,
          LTS: 0,
          EDU: 0,
          GIV: 50,
          LQT: 950,
        })
      })
    })
  });
});


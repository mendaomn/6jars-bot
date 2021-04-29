import { Earning, Expense, Jar, JarName, Movement } from "../../types";
import {
  CurrentJarsCommand,
  EarnCommand,
  SpendCommand,
} from "../commands/types";

export async function onSpend(
  storeExpense: (amount: number, jar: JarName) => Promise<any>,
  command: SpendCommand
) {
  try {
    await storeExpense(command.amount, command.jar);
    return "Expense created successfully";
  } catch (err) {
    return `${err}`;
  }
}

export async function onEarn(
  storeEarning: (amount: number) => Promise<any>,
  command: EarnCommand
) {
  try {
    await storeEarning(command.amount);
    return "Earning created successfully";
  } catch (err) {
    return `${err}`;
  }
}

function applyEarning(
  jarsConfig: Jar[],
  jars: Record<JarName, number>,
  earning: Earning
) {
  const { amount } = earning;
  jarsConfig.forEach((jar) => {
    jars[jar.name] += jar.percentage * amount;
  });

  return jars;
}

function applyExpense(jars: Record<JarName, number>, expense: Expense) {
  const { jar, amount } = expense;

  jars[jar] -= amount;
  return jars;
}

export function computeJars(jarsConfig: Jar[], movements: Movement[]) {
  const initialJars: Record<JarName, number> = {
    NEC: 0,
    PLY: 0,
    FFA: 0,
    LTS: 0,
    EDU: 0,
    GIV: 0,
  };

  return movements.reduce((currentJars, movement) => {
    switch (movement.type) {
      case "expense":
        return applyExpense(currentJars, movement);
      case "earning":
        return applyEarning(jarsConfig, currentJars, movement);
    }
  }, initialJars);
}

export async function onCurrentJars(
  getJars: () => Promise<Jar[]>,
  getMovements: () => Promise<Movement[]>,
  command: CurrentJarsCommand
) {
  try {
    const jarsConfig = await getJars();
    const movements = await getMovements();
    const jars = computeJars(jarsConfig, movements);

    return `Here's the content of your jars:

🏠 NEC: ${jars.NEC}€
🍷 PLY: ${jars.PLY}€
📈 FFA: ${jars.FFA}€
📱 LTS: ${jars.LTS}€
📚 EDU: ${jars.EDU}€
🎁 GIV: ${jars.GIV}€
`;
  } catch (err) {
    return `${err}`;
  }
}

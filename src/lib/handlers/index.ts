import {
  DebugMovement,
  Jar,
  JarName,
  Movement,
} from "../../types";
import {
  CurrentJarsCommand,
  DebugCommand,
  EarnCommand,
  MoveCommand,
  ResetCommand,
  SpendCommand,
} from "../commands/types";
import { getLastSnapshot } from "../storage";
import { computeJars } from "./jars/computeJars";

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

export async function onMove(
  storeTransfer: (
    fromJar: JarName,
    toJar: JarName,
    amount: number
  ) => Promise<any>,
  command: MoveCommand
) {
  try {
    await storeTransfer(command.fromJar, command.toJar, command.amount);
    return "Transfer created successfully";
  } catch (err) {
    return `${err}`;
  }
}

export async function onReset(
  storeReset: () => Promise<any>,
  command: ResetCommand
) {
  try {
    await storeReset();
    return "Reset created successfully";
  } catch (err) {
    return `${err}`;
  }
}

function formatTotal(total: number) {
  return total.toLocaleString("it-IT");
}

export async function onCurrentJars(
  getJars: () => Promise<Jar[]>,
  getMovements: (after?: string) => Promise<Movement[]>,
  command: CurrentJarsCommand
) {
  try {
    let jars: Record<JarName, number> = {
      NEC: 0,
      PLY: 0,
      FFA: 0,
      EDU: 0,
      LTS: 0,
      GIV: 0,
      CNT: 0,
      LQT: 0
    }
    const snapshot = await getLastSnapshot()
    if (snapshot) {
      console.log({snapshotFound: true, snapshot})
      // `after` is inclusive, I should skip the first result
      const [_, ...movements] = await getMovements(snapshot.lastDocumentInSnapshotRef)
      jars = computeJars(snapshot.state, movements)
    } else {
      console.log({snapshotFound: false})
      const jarsConfig = await getJars();
      const movements = await getMovements();
      jars = computeJars(jarsConfig, movements);
    }
    

    return `Here's the content of your jars:

🏠 NEC: ${formatTotal(jars.NEC)}€
🍷 PLY: ${formatTotal(jars.PLY)}€
📈 FFA: ${formatTotal(jars.FFA)}€
📱 LTS: ${formatTotal(jars.LTS)}€
📚 EDU: ${formatTotal(jars.EDU)}€
🎁 GIV: ${formatTotal(jars.GIV)}€
☂️ CNT: ${formatTotal(jars.CNT)}€
💰 LQT: ${formatTotal(jars.LQT)}€
`;
  } catch (err) {
    return `${err}`;
  }
}

export async function onDebug(
  getDebugMovements: () => Promise<DebugMovement[]>,
  command: DebugCommand
) {
  const SPACES = '          '
  try {
    const movements = await getDebugMovements();
    const last50Movements = movements.reverse().splice(0, 50)

    return last50Movements
      .filter(m => m.type === 'expense')
      .map((m: any)=> `${formatTotal(m.amount)}€${SPACES}${m.jar}${SPACES}${new Date(m.timestamp).toLocaleDateString('it-IT')}`)
      .join('\n')
  } catch (err) {
    return `${err}`;
  }
}

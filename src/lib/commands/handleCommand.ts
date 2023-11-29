import { Command } from "./types";
import { onCurrentJars, onEarn, onMove, onReset, onSpend, onDebug } from "../handlers";
import {
  getDebugMovements,
  getJars,
  getMovements,
  storeEarning,
  storeExpense,
  storeReset,
  storeTransfer
} from "../storage";

export async function handleCommand(command: Command): Promise<string> {
  switch (command.name) {
    case "spend":
      return onSpend(storeExpense, command);
    case "earn":
      return onEarn(storeEarning, command);
    case "move":
      return onMove(storeTransfer, command);
    case "jars":
      return onCurrentJars(getJars, getMovements, command);
    case "reset":
      return onReset(storeReset, command);
    case "error":
      return command.message;
    case "debug":
      return onDebug(getDebugMovements, command);
  }
}

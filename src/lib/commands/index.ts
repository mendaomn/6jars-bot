import { JarName } from "../../types";
import {
  SpendCommand,
  EarnCommand,
  CurrentJarsCommand,
  ErrorCommand,
  MoveCommand,
  ResetCommand,
} from "./types";

export function spendCommand(amount: number, jar: JarName): SpendCommand {
  return {
    name: "spend",
    amount,
    jar,
  };
}

export function earnCommand(amount: number): EarnCommand {
  return {
    name: "earn",
    amount,
  };
}

export function moveCommand(
  fromJar: JarName,
  toJar: JarName,
  amount: number
): MoveCommand {
  return {
    name: "move",
    amount,
    fromJar,
    toJar,
  };
}

export function currentJarsCommand(): CurrentJarsCommand {
  return {
    name: "jars",
  };
}

export function resetCommand(): ResetCommand {
  return {
    name: "reset",
  };
}

export function errorCommand(message: string): ErrorCommand {
  return {
    name: "error",
    message,
  };
}

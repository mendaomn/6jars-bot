import { JarName } from "../../types";

export interface SpendCommand {
  name: "spend";
  amount: number;
  jar: JarName;
}

export interface CurrentJarsCommand {
  name: "jars";
}

export interface EarnCommand {
  name: "earn";
  amount: number;
}

export interface MoveCommand {
  name: "move";
  amount: number;
  fromJar: JarName;
  toJar: JarName;
}

export interface ResetCommand {
  name: "reset";
}

export interface ErrorCommand {
  name: "error";
  message: string;
}

export interface DebugCommand {
  name: "debug";
}

export type Command =
  | SpendCommand
  | EarnCommand
  | MoveCommand
  | CurrentJarsCommand
  | ResetCommand
  | ErrorCommand
  | DebugCommand;

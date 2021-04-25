import { JarName } from "../../types";

export interface SpendCommand {
    name: 'spend';
    amount: number;
    jar: JarName;
}

export interface CurrentJarsCommand {
    name: 'jars current';
}

export interface EarnCommand {
    name: 'earn';
    amount: number;
}

export type Command =
    | SpendCommand
    | EarnCommand
    | CurrentJarsCommand
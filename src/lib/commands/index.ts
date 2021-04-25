import { JarName } from "../../types"
import { SpendCommand, EarnCommand, CurrentJarsCommand } from "./types"

export function spendCommand(amount: number, jar: JarName): SpendCommand {
    return {
        name: "spend",
        amount,
        jar,
    }
}

export function earnCommand(amount: number): EarnCommand {
    return {
        name: 'earn',
        amount,
    }
}

export function currentJarsCommand(): CurrentJarsCommand {
    return {
        name: 'jars current',
    }
}
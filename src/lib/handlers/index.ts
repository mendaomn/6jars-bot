import { Jar, JarName } from "../../types";
import { CurrentJarsCommand, EarnCommand, SpendCommand } from "../commands/types";
import { load, store } from "../storage";

export function spend(jars: Jar[], targetJar: JarName, amount: number): Jar[] {
    return jars.map(jar => jar.name === targetJar
        ? {
            ...jar,
            amount: jar.amount - amount,
        }
        : jar)
}

export function earn(jars: Jar[], amount: number): Jar[] {
    return jars.map(jar => ({
        ...jar,
        amount: jar.amount += amount * jar.percentage
    }))
}

export function onSpend(command: SpendCommand) {
    const result = load<Jar[]>('jars')

    if (typeof result === 'string')
        return;

    const newData = spend(result.data, command.jar, command.amount)

    store('jars', newData)
}

export function onEarn(command: EarnCommand) {
    const result = load<Jar[]>('jars')

    if (typeof result === 'string')
        return;

    const newData = earn(result.data, command.amount)

    store('jars', newData)
}

export function onCurrentJars(command: CurrentJarsCommand) {
    const result = load<Jar[]>('jars')

    if (typeof result === 'string')
        return;

    console.log(result.data)
}
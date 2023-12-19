import { Jar, JarName, Earning, Expense, Transfer, Reset, Movement } from "../../../types";


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

function applyTransfer(jars: Record<JarName, number>, expense: Transfer) {
    const { fromJar, toJar, amount } = expense;

    jars[fromJar] -= amount;
    jars[toJar] += amount;
    return jars;
}

function applyReset(jars: Record<JarName, number>, reset: Reset) {
    const { NEC, FFA, PLY, LTS, EDU } = jars
    jars.LQT += NEC + FFA + PLY + LTS + EDU
    jars.NEC = 0
    jars.FFA = 0
    jars.PLY = 0
    jars.LTS = 0
    jars.EDU = 0
    return jars;
}

export function computeJars(jarsConfig: Jar[], movements: Movement[]) {
    const necessityJar = jarsConfig.find(jar => jar.name === 'NEC')
    const playJar = jarsConfig.find(jar => jar.name === 'PLY')
    const financialFreedomJar = jarsConfig.find(jar => jar.name === 'FFA')
    const longTermSavingsJar = jarsConfig.find(jar => jar.name === 'LTS')
    const educationJar = jarsConfig.find(jar => jar.name === 'EDU')
    const giveJar = jarsConfig.find(jar => jar.name === 'GIV')
    const contingencyJar = jarsConfig.find(jar => jar.name === 'CNT')
    const liquidityJar = jarsConfig.find(jar => jar.name === 'LQT')

    const initialJars: Record<JarName, number> = {
        NEC: necessityJar?.amount || 0,
        PLY: playJar?.amount || 0,
        FFA: financialFreedomJar?.amount || 0,
        LTS: longTermSavingsJar?.amount || 0,
        EDU: educationJar?.amount || 0,
        GIV: giveJar?.amount || 0,
        CNT: contingencyJar?.amount || 0,
        LQT: liquidityJar?.amount || 0,
    };

    return movements.reduce((currentJars, movement): Record<JarName, number> => {
        switch (movement.type) {
            case "expense":
                return applyExpense(currentJars, movement);
            case "earning":
                return applyEarning(jarsConfig, currentJars, movement);
            case "transfer":
                return applyTransfer(currentJars, movement);
            case "reset":
                return applyReset(currentJars, movement);
        }
    }, initialJars);
}
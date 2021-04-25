import { currentJarsCommand, earnCommand, spendCommand } from "./lib/commands";
import { Command } from "./lib/commands/types";
import { onCurrentJars, onEarn, onSpend } from "./lib/handlers";
import { store } from "./lib/storage";
import { Jar } from "./types";

function setupState() {
    const necJar: Jar = {
        id: 'ply-id',
        amount: 0,
        name: 'NEC',
        percentage: 0.15,
    }

    const plyJar: Jar = {
        id: 'ply-id',
        amount: 0,
        name: 'PLY',
        percentage: 0.15,
    }

    store('jars', [
        necJar,
        plyJar,
    ])
}

function handleCommand(command: Command) {
    switch (command.name) {
        case 'spend':
            onSpend(command);
            break;
        case 'jars current':
            onCurrentJars(command);
            break;
        case 'earn':
            onEarn(command);
            break;
    }
}

async function main() {
    setupState()

    handleCommand(spendCommand(12, 'NEC'));
    handleCommand(earnCommand(1000));
    handleCommand(currentJarsCommand());
}

main().catch(console.error.bind(console))

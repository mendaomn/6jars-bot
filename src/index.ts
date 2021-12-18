import { Telegraf } from "telegraf";
import { authMiddleware } from "./lib/actions/auth";
import { earnAction } from "./lib/actions/earn";
import { jarsAction } from "./lib/actions/jars";
import { moveAction } from "./lib/actions/move";
import { resetAction } from "./lib/actions/reset";
import { spendAction } from "./lib/actions/spend";
import { Command } from "./lib/commands/types";
import { onCurrentJars, onEarn, onMove, onReset, onSpend } from "./lib/handlers";
import {
  getJars,
  getMovements,
  storeEarning,
  storeExpense,
  storeReset,
  storeTransfer,
} from "./lib/storage";

async function handleCommand(command: Command): Promise<string> {
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
  }
}

function main() {
  const token = process.env.TELEGRAM_TOKEN;

  if (!token) throw new Error("TELEGRAM_TOKEN must be provided");

  const bot = new Telegraf(token, { telegram: { webhookReply: true } });

  bot.start((ctx) => ctx.reply("hello"));

  bot.use(async (ctx, next) => {
    const command = authMiddleware(ctx.message?.from.id || 0, ctx.chat?.id || 0);

    if (command) {
      return ctx.reply(await handleCommand(command));
    }

    await next();
  });

  bot.command("jars", async (ctx) => {
    const command = jarsAction();
    return ctx.reply(await handleCommand(command));
  });
  
  bot.command("reset", async (ctx) => {
    const command = resetAction();
    return ctx.reply(await handleCommand(command));
  });

  bot.command("spend", async (ctx) => {
    const command = spendAction(ctx.message.text);
    return ctx.reply(await handleCommand(command));
  });

  bot.command("earn", async (ctx) => {
    const command = earnAction(ctx.message.text);
    return ctx.reply(await handleCommand(command));
  });

  bot.command("move", async (ctx) => {
    const command = moveAction(ctx.message.text);
    return ctx.reply(await handleCommand(command));
  });

  return bot;
}

const bot = main();

if (process.env.NODE_ENV === "dev") {
  bot.launch();
}

export { bot };

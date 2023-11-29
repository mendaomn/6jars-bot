import { Telegraf } from "telegraf";
import { authMiddleware } from "../actions/auth";
import { debugAction } from "../actions/debug";
import { earnAction } from "../actions/earn";
import { jarsAction } from "../actions/jars";
import { moveAction } from "../actions/move";
import { resetAction } from "../actions/reset";
import { spendAction } from "../actions/spend";
import { handleCommand } from "../commands/handleCommand";

export function createBot() {
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

  bot.catch((err, ctx) => {
    console.error(err, ctx.message);
  });

  bot.command("jars", async (ctx) => {
    console.log(`Command received`, ctx.message.text);
    const command = jarsAction();
    const result = await ctx.reply(await handleCommand(command));
    console.log(`Will reply with`, result);
    return result;
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

  bot.command("debug", async (ctx) => {
    const command = debugAction();
    return ctx.reply(await handleCommand(command));
  });

  return bot;
}

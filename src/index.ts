import { createBot } from "./lib/bot";

const bot = createBot();

if (process.env.NODE_ENV === "dev") {
  bot.launch();
}

export { bot };

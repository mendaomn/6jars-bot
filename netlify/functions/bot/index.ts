import { Handler } from "@netlify/functions";
import { bot } from "../../../src";

export const handler: Handler = async (event) => {
  await bot.handleUpdate(JSON.parse(event.body || ""));
  return { statusCode: 200, body: "" };
};

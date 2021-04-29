import { earnCommand, errorCommand } from "../../commands";

function parseContent(text: string) {
  const [, amount] = text.replace(/ +/g, " ").split(" ");

  const numberAmount = parseFloat(amount);

  return { amount: numberAmount };
}

export function earnAction(message: string) {
  const { amount } = parseContent(message);

  if (!amount) return errorCommand("Amount should be a number");

  return earnCommand(amount);
}

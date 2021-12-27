import { JarName } from "../../../types";
import { errorCommand, moveCommand, spendCommand } from "../../commands";
import numeral from "numeral";
import { setupLocale } from "../../utils";

const numberFormatter = setupLocale(numeral);

const JAR_NAMES: JarName[] = ["NEC", "PLY", "FFA", "EDU", "LTS", "GIV", "CNT", "LQT"];

function toJarName(jar: string): JarName | undefined {
  return JAR_NAMES.find((name) => jar?.toUpperCase() === name);
}

function parseContent(text: string) {
  const [, amount, fromJarInput, toJarInput] = text
    .replace(/ +/g, " ")
    .split(" ");

  const numberAmount = numberFormatter(amount).value();
  const fromJar = toJarName(fromJarInput);
  const toJar = toJarName(toJarInput);

  return { amount: numberAmount, fromJar, toJar };
}

export function moveAction(message: string) {
  const { amount, fromJar, toJar } = parseContent(message);

  if (!amount) return errorCommand("Amount should be a number");
  if (!fromJar || !toJar)
    return errorCommand(
      "Jar name should be one of NEC, PLY, FFA, EDU, LTS, GIV"
    );

  return moveCommand(fromJar, toJar, amount);
}

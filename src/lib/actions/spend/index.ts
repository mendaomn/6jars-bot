import { JarName } from "../../../types";
import { errorCommand, spendCommand } from "../../commands";
import numeral from "numeral";
import { setupLocale } from "./utils";

const numberFormatter = setupLocale(numeral);

const JAR_NAMES: JarName[] = ["NEC", "PLY", "FFA", "EDU", "LTS", "GIV"];

function toJarName(jar: string): JarName | undefined {
  return JAR_NAMES.find((name) => jar?.toUpperCase() === name);
}

function parseContent(text: string) {
  const [, amount, jar] = text.replace(/ +/g, " ").split(" ");

  const numberAmount = numberFormatter(amount).value();
  const jarName = toJarName(jar);

  return { amount: numberAmount, jar: jarName };
}

export function spendAction(message: string) {
  const { amount, jar } = parseContent(message);

  if (!amount) return errorCommand("Amount should be a number");
  if (!jar)
    return errorCommand(
      "Jar name should be one of NEC, PLY, FFA, EDU, LTS, GIV"
    );

  return spendCommand(amount, jar);
}

export type JarName = "NEC" | "PLY" | "FFA" | "EDU" | "LTS" | "GIV";

export interface Jar {
  name: JarName;
  percentage: number;
}

export interface Expense {
  type: "expense";
  timestamp: number;
  amount: number;
  jar: JarName;
}

export interface Earning {
  type: "earning";
  timestamp: number;
  amount: number;
}

export type Movement = Expense | Earning;

export type JarName = "NEC" | "PLY" | "FFA" | "EDU" | "LTS" | "GIV" | "CNT" | "LQT";

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

export interface Transfer {
  type: "transfer";
  timestamp: number;
  amount: number;
  fromJar: JarName;
  toJar: JarName;
}

export interface Reset {
  type: "reset";
  timestamp: number;
}

export type Movement = Expense | Earning | Transfer | Reset;

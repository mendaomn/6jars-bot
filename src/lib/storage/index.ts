import faunadb from "faunadb";
import { DebugMovement, Jar, JarName, Movement, Reset, Transfer } from "../../types";

const secret = process.env.FAUNA_SECRET;

if (!secret) throw new Error("FAUNA_SECRET must be provided");

const q = faunadb.query;
const client = new faunadb.Client({ secret });

interface Document {
  ref: unknown;
  ts: number;
  data: any;
}

interface QueryResult {
  data: Document[];
}

function toJar(document: Document): Jar {
  return document.data;
}

function toMovement(document: Document): Movement {
  return document.data;
}

export async function getJars() {
  const { data } = await client.query<QueryResult>(
    q.Map(
      q.Paginate(q.Documents(q.Collection("jars"))),
      q.Lambda((x) => q.Get(x))
    )
  );

  return data.map(toJar);
}

export async function getMovements() {
  const { data } = await client.query<QueryResult>(
    q.Map(
      q.Paginate(q.Documents(q.Collection("movements")), { size: 100000 }),
      q.Lambda((x) => q.Get(x))
    )
  );

  return data.map(toMovement);
}

function makeExpenseMovement(amount: number, jar: JarName): Movement {
  return {
    type: "expense",
    amount,
    jar,
    timestamp: Date.now(),
  };
}

export async function storeExpense(amount: number, jar: JarName) {
  return client.query(
    q.Create(q.Collection("movements"), {
      data: makeExpenseMovement(amount, jar),
    })
  );
}

function makeEarningMovement(amount: number): Movement {
  return {
    type: "earning",
    amount,
    timestamp: Date.now(),
  };
}

export async function storeEarning(amount: number) {
  return client.query(
    q.Create(q.Collection("movements"), {
      data: makeEarningMovement(amount),
    })
  );
}

function makeTransferMovement(
  fromJar: JarName,
  toJar: JarName,
  amount: number
): Transfer {
  return {
    type: "transfer",
    amount,
    timestamp: Date.now(),
    fromJar,
    toJar,
  };
}

export async function storeTransfer(
  fromJar: JarName,
  toJar: JarName,
  amount: number
) {
  return client.query(
    q.Create(q.Collection("movements"), {
      data: makeTransferMovement(fromJar, toJar, amount),
    })
  );
}

function makeResetMovement(): Reset {
  return {
    type: 'reset',
    timestamp: Date.now()
  }
}

export async function storeReset() {
  return client.query(
    q.Create(q.Collection("movements"), {
      data: makeResetMovement(),
    })
  );
}

function toDebugMovement(document: Document): DebugMovement {
  return {
    ref: document.ref,
    ...document.data
  };
}

export async function getDebugMovements() {
  const { data } = await client.query<QueryResult>(
    q.Map(
      q.Paginate(q.Documents(q.Collection("movements")), { size: 100000 }),
      q.Lambda((x) => q.Get(x))
    )
  );

  return data.map(toDebugMovement);
}

import faunadb from "faunadb";
import { Jar, JarName, Movement } from "../../types";

const secret = "fnAEHvJbs7ACBaGO61UitXwpjr6ux_3SvUFiKTVy";

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
      q.Paginate(q.Documents(q.Collection("movements"))),
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

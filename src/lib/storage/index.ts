import faunadb from "faunadb";
import { DebugMovement, Jar, JarName, Movement, Reset, Transfer } from "../../types";
import { Snapshot } from "./snapshot";

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
  after?: unknown;
}

function toJar(document: Document): Jar {
  return document.data;
}

function toMovement(document: Document): Movement {
  return document.data;
}

function toSnapshot(document: Document): Snapshot<Jar[]> {
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

const PAGE_SIZE = 500

async function getAllPages(getPage: CallableFunction, after?: string) {
  let { data, after: token } = await getPage(PAGE_SIZE, after)
  const allData = data.concat()

  while (token) {
    const additionalData = await getPage(PAGE_SIZE, token)
    allData.push(...additionalData.data)
    token = additionalData.after
  }

  return allData
}

export async function getMovements(after?: string) {
  async function getPage(pageSize: number, token?: unknown) {
    console.log({page_requested: 'movements'})
    const result = await client.query<QueryResult>(
      q.Map(
        q.Paginate(q.Documents(q.Collection("movements")), {
          size: pageSize,
          after: token
        }),
        q.Lambda((x) => q.Get(x))
      )
    );
    console.log({page_requested: 'movements', result})
    return result
  }

  const data = await getAllPages(getPage, after)

  return data.map(toMovement);
}

function makeSnapshot(lastDocumentInSnapshotRef: string, jars: Jar[]): Snapshot<Jar[]> {
  return {
    state: jars,
    lastDocumentInSnapshotRef,
    timestamp: Date.now(),
  };
}


export async function getLastSnapshot(): Promise<Snapshot<Jar[]>> {
  const { data } = await client.query<QueryResult>(
    q.Map(
      q.Paginate(
        q.Reverse(
          q.Documents(
            q.Collection("snapshots")
          )
        ),
        { size: 1 }
      ),
      q.Lambda((x) => q.Get(x))
    ));

  return data.map(toSnapshot)?.[0]
}

export function storeSnapshot(lastDocumentInSnapshotRef: string, jars: Jar[]) {
  return client.query(
    q.Create(q.Collection("snapshots"), {
      data: makeSnapshot(lastDocumentInSnapshotRef, jars),
    })
  );
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
  async function getPage(pageSize: number, token?: unknown) {
    return client.query<QueryResult>(
      q.Map(
        q.Paginate(q.Documents(q.Collection("movements")), {
          size: pageSize,
          after: token
        }),
        q.Lambda((x) => q.Get(x))
      )
    );
  }

  const data = await getAllPages(getPage)

  return data.map(toDebugMovement);
}

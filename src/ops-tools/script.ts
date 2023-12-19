import faunadb from "faunadb";
import { getJars } from "../lib/storage";
import { Expense, JarName, Movement } from "../types";
// import { stringify } from 'csv-stringify/sync'
import { setupLocale } from "../lib/utils";
import numeral from "numeral";
import { computeJars } from "../lib/handlers/jars/computeJars";

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
  after: unknown;
}

type DebugMovement = Movement & {
  ref: unknown
}

function toMovement(document: Document): DebugMovement {
  return {
    ref: document.ref,
    ...document.data
  };
}

async function getMovements() {
  async function getPage(token?: unknown) {
    return client.query<QueryResult>(
      q.Map(
        q.Paginate(q.Documents(q.Collection("movements")), { 
          size: 500,
          after: token
        }),
        q.Lambda((x) => q.Get(x))
      )
    );
  }

  let {data, after: token} = await getPage()
  const allData = data.concat()
  while (token) {
    const additionalData = await getPage(token)
    allData.push(...additionalData.data)
    token = additionalData.after
  }

  return allData.map(toMovement);
}

async function findBy(predicate: (d: DebugMovement) => boolean) {
  const movements = await getMovements()
  return movements.reverse().find(predicate)
}

async function findLastReset(movements: DebugMovement[]) {
  return movements.filter(m => m.type === 'reset').sort((a, b) => b.timestamp - a.timestamp)[0]
}

function printJars(jars: Record<JarName, number>) {
  const keys = Object.keys(jars) as JarName[]
  for (let key of keys) {
    console.log(`${key}: ${jars[key].toLocaleString("it-IT")}`) 
  }
}


async function run() {
  // --CSV with all expenses
  // const numberFormatter = setupLocale(numeral)
  // const movements = await getMovements()
  // const withDate = movements.filter(m => m.type === 'expense' && m.jar != 'LQT')
  //   .map((m: any) => ({
  //     ...m,
  //     amount: numberFormatter(m.amount).format('0.00'),
  //     date: new Date(m.timestamp!).toISOString()
  //   }))

  //   // console.log(withDate)

  //   const csv = stringify(withDate, {
  //     columns: [{key: 'date'}, {key: 'amount'}]
  //   })
  //   console.log(csv)

  // --LQT trend over time
  const jarsConfig = await getJars()
  const movements = await getMovements()
  const allResets = movements.filter(m => m.type === 'reset')
  const splitByResets = allResets.map(reset => {
    const resetIndex = movements.indexOf(reset)
    return movements.slice(0, resetIndex)
  })
  
  for (let split of splitByResets) {
    const result = computeJars(jarsConfig, split)
    console.log(result.CNT)
  }

  // --NEC since last reset
  // const jarsConfig = await getJars()
  // const movements = await getMovements()
  // const [secondToLastReset, lastReset] = movements.filter(m => m.type === 'reset').slice(-2)
  // const allExpenses = movements.filter(m => m.type === 'expense' && m.jar === 'NEC')
  // const betweenResets = allExpenses.filter(movement => {
  //   return movement.timestamp > secondToLastReset.timestamp && movement.timestamp < lastReset.timestamp
  // })
  
  // // const total = betweenResets.reduce((cum, expense) => cum + expense.amount, 0)
  // console.log(betweenResets.map((m: any) => ({
  //   amount: m.amount,
  //   date: new Date(m.timestamp).toLocaleDateString()
  // })))

  // --find last
  // const movement = await findBy((movement) => {
  //   return movement.type === 'expense'
  // })
  // console.log(movement)
  // console.log(new Date(movement!.timestamp).toISOString())

  // -- /jars
  // try {
  // const jarsConfig = await getJars()
  // const movements = await getMovements()
  // console.log(computeJars(jarsConfig, movements))
  // } catch(err) {
  //   console.log(err)
  // }
}

run().catch((err) => {
  console.error(err.description)
  console.error(err.responnseContent.errors)
})
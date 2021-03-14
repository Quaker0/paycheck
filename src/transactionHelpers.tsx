export interface MonthlyTransaction {
  transactions: Array<Array<String|number>>;
  salary: number;
  month: string;
}

export interface TransactionTotals {
  cost: number;
  revenue: number;
  currency: String;
}

export function parseMonthlyTransactions(transactions: Array<Array<String|number>>): Array<MonthlyTransaction> {
  const headers = transactions[0];
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  const labelIdx = headers.indexOf("Rubrik");
  let monthlyTransactions: Array<MonthlyTransaction> = [];
  let monthTransactions = [];
  let salary = 0;
  for (let i = 1; i < transactions.length; i++) {
    monthTransactions.push(transactions[i])
    if (transactions[i][labelIdx] === "Lön") {
      salary = parseInt(transactions[i][valueIdx].toString());
      if (monthTransactions.length > 1 && !parseInt(transactions[i][labelIdx].toString())) {
        const date = new Date(monthTransactions[0][dateIdx].toString());
        monthlyTransactions.push({transactions: monthTransactions, salary: salary, month: date.toLocaleString('default', { month: 'long' })})
        monthTransactions = [];
      }
    }
  }
  return monthlyTransactions;
}

export function parseCostTransactions(headers: Array<String>, monthlyTransaction: MonthlyTransaction) {
  const valueIdx = headers.indexOf("Belopp");
  let costTransactions: Array<Array<String|number>> = [];
  monthlyTransaction.transactions.forEach((tx: Array<String|number>) => {
    if (tx[valueIdx].toString().startsWith("-")) {
      costTransactions.push(tx);
    }
  });
  return {transactions: costTransactions, salary: monthlyTransaction.salary, month: monthlyTransaction.month };
}

export function calculateRecurring(transactionHeaders: Array<String>, monthlyTransactions: any) {
    let transactionMap: any = {};
    const valueIdx = transactionHeaders.indexOf("Belopp");
    const dateIdx = transactionHeaders.indexOf("Bokföringsdag");
    const labelIdx = transactionHeaders.indexOf("Rubrik");
    const currency = monthlyTransactions[0].transactions[0][transactionHeaders.indexOf("Valuta")];
    monthlyTransactions.forEach((mt: any) => {
      let monthlyTransactionMap: any = {};
      mt.transactions.forEach((transaction: Array<String>) => {
        if (transaction[labelIdx] !== "Lön") {
          monthlyTransactionMap[transaction[labelIdx].toString()] = {date: transaction[dateIdx], value: -parseInt(transaction[valueIdx].toString())};
        }
      });
      if (!Object.keys(transactionMap).length) {
        transactionMap = monthlyTransactionMap;
      }
      else {
        Object.keys(transactionMap).forEach((key: string) => {
          if (!(key in monthlyTransactionMap)) {
            delete transactionMap[key];
          }
          else {
            let dComp = new Date(transactionMap[key].date);
            let d = new Date(monthlyTransactionMap[key].date)
            if ( d.getDate() < dComp.getDate() - 2 || d.getDate() > dComp.getDate() + 2) {
              delete transactionMap[key];
            }
          }
        });
      }
    });
    let monthlyTotals = monthlyTransactions.map((mt: any) => {
      return mt.transactions.map((tx: Array<String>) => tx[labelIdx].toString() in transactionMap ? -parseInt(tx[valueIdx].toString()) : null).filter(Boolean).reduce((a: number, b: number) => a + b, 0);
    });
    return {monthlyTotals: monthlyTotals, currency: currency}
  }

export function calcMonthTotals(headers: Array<String>, monthlyTransactions: Array<MonthlyTransaction>): Array<TransactionTotals> {
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  const currency = monthlyTransactions[0].transactions[0][headers.indexOf("Valuta")];

  return monthlyTransactions.map(monthlyTransaction => {
    let sortedTransactions = monthlyTransaction.transactions.sort((a, b) => {
      if (a[dateIdx] === b[dateIdx]) { return 0} ;
      return Date.parse(a[dateIdx].toString()) > Date.parse(b[dateIdx].toString()) ? 1 : -1;
    });

    let totals = {cost: 0, revenue: 0, currency: currency.toString()};
    sortedTransactions.some(tx => {
      let txDate = new Date(tx[dateIdx].toString());
      if (txDate.getDate() === (new Date()).getDate()) {
        return true;
      }
      const txValue = parseInt(tx[valueIdx].toString());
      if (txValue > 0) {
        totals.revenue += txValue;
      }
      else if (txValue < 0) {
        totals.cost -= txValue;
      }
      return null;
    });
    return totals;
  });
}


export function median(values: Array<number>){
  if(values.length ===0) return 0;

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}


export function calcMonthCosts(headers: Array<String>, monthlyTransaction: MonthlyTransaction): Array<{date: String, value: Number} | undefined> {
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  
  let sortedTransactions = monthlyTransaction.transactions.sort((a, b) => {
    if (a[dateIdx] === b[dateIdx]) { return 0} ;
    return Date.parse(a[dateIdx].toString()) > Date.parse(b[dateIdx].toString()) ? 1 : -1;
  });

  let totalAmount = monthlyTransaction.salary;
  return sortedTransactions.map(tx => {
    const txValue = parseInt(tx[valueIdx].toString());
    if (txValue > -20000) {
      totalAmount += txValue;
      return {date: parseInt(tx[dateIdx].toString().split("-")[2]).toString(), value: totalAmount};
    }
    return undefined;
  }).filter(Boolean);
}

function _avg(values: Array<number>) {
  return Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
}

export function calcAvg(values: Array<number>) {
  if (values.length > 0) {
    return _avg(values.filter((val: number) => val < 2 * median(values)));
  }
  return 0;
}

export interface MonthlyTransaction {
  transactions: Array<Array<String|number>>;
  salary: number;
}

export interface TransactionTotals {
  cost: number;
  revenue: number;
  currency: String;
}

export function parseMonthlyTransactions(transactions: Array<Array<String|number>>): Array<MonthlyTransaction> {
  const headers = transactions[0];
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
        monthlyTransactions.push({transactions: monthTransactions, salary: salary})
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
  return {transactions: costTransactions, salary: monthlyTransaction.salary };
}


export function calcMonthTotals(headers: Array<String>, monthlyTransaction: MonthlyTransaction): TransactionTotals {
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  const currency = monthlyTransaction.transactions[0][headers.indexOf("Valuta")];  

  let sortedTransactions = monthlyTransaction.transactions.sort((a, b) => {
    if (a[dateIdx] === b[dateIdx]) { return 0} ;
    return Date.parse(a[dateIdx].toString()) > Date.parse(b[dateIdx].toString()) ? 1 : -1;
  });

  let totals = {cost: 0, revenue: 0, currency: currency.toString()};
  sortedTransactions.forEach(tx => {
    const txValue = parseInt(tx[valueIdx].toString());
    if (txValue > 0) {
      totals.revenue += txValue;
    }
    else if (txValue < 0) {
      totals.cost -= txValue
    }
  });
  return totals;
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
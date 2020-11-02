import React from "react";
import ValueCard from "./ValueCard";
import Grid from "@material-ui/core/Grid";
import { calcAvg } from "../transactionHelpers";

export default function OverviewCards(props: any) {
  const { classes, currentMonthTotals, monthlyRecurring } = props;
  const monthlyRecurringAvg = calcAvg(monthlyRecurring.monthlyTotals.slice(1).filter((val: number) => val < 3 * calcAvg(monthlyRecurring.monthlyTotals.slice(1))))
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={5}>
          <Grid key="income" item>
            <ValueCard label="Income" amount={currentMonthTotals.revenue} currency={currentMonthTotals.currency} />
          </Grid>
          <Grid key="expenses" item>
            <ValueCard label="Expenses" amount={currentMonthTotals.cost} currency={currentMonthTotals.currency} />
          </Grid>
          <Grid key="netEarnings" item>
            <ValueCard label="Net earnings" amount={currentMonthTotals.revenue - currentMonthTotals.cost} currency={currentMonthTotals.currency} textColor={currentMonthTotals.revenue < currentMonthTotals.cost ? "error" : undefined}/>
          </Grid>
          <Grid key="currentRecurring" item>
            <ValueCard label="Recurring expenses" amount={monthlyRecurring.monthlyTotals[0]} avgAmount={monthlyRecurringAvg} currency={monthlyRecurring.currency} lowerIsBetter/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
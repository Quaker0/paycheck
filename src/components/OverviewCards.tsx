import React from "react";
import ValueCard from "./ValueCard";
import Grid from "@material-ui/core/Grid";
import { calcAvg } from "../transactionHelpers";

export default function OverviewCards(props: any) {
  const { classes, monthTotals, monthlyRecurring, monthIdx } = props;
  const monthlyRecurringAvg = calcAvg(monthlyRecurring.monthlyTotals.slice(1))
  const monthlyRevenueAvg = calcAvg(monthTotals.map((t: any) => t.revenue));
  const monthlyCostAvg = calcAvg(monthTotals.map((t: any) => t.cost));
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={5}>
          <Grid key="income" item>
            <ValueCard label="Income" amount={monthTotals[monthIdx].revenue} avgAmount={monthlyRevenueAvg} currency={monthTotals[monthIdx].currency} />
          </Grid>
          <Grid key="expenses" item>
            <ValueCard label="Expenses" amount={monthTotals[monthIdx].cost} avgAmount={monthlyCostAvg} currency={monthTotals[monthIdx].currency} lowerIsBetter />
          </Grid>
          <Grid key="netEarnings" item>
            <ValueCard label="Net earnings" amount={monthTotals[monthIdx].revenue - monthTotals[monthIdx].cost} avgAmount={monthlyRevenueAvg - monthlyCostAvg} currency={monthTotals[monthIdx].currency} textColor={monthTotals[monthIdx].revenue < monthTotals[monthIdx].cost ? "error" : undefined}/>
          </Grid>
          <Grid key="currentRecurring" item>
            <ValueCard label="Recurring expenses" amount={monthlyRecurring.monthlyTotals[monthIdx]} avgAmount={monthlyRecurringAvg} currency={monthlyRecurring.currency} lowerIsBetter />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
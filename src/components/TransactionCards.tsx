import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: 50
  },
  text: {
    fontSize: 14,
    width: "100%",
    margin: 0,
    padding: 0
  },
  date: {
    fontWeight: 700
  },
  content: {
    paddingTop: 25
  }
});

interface Props {
  transactions: any;
  transactionHeaders: any;
}

function TransactionCard(props: any) {
  const { headers, transactions, classes } = props;
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  const labelIdx = headers.indexOf("Rubrik");
  const currencyIdx = headers.indexOf("Valuta");
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent className={classes.content}>
          <Typography className={classes.text}>
            <strong>{transactions[dateIdx]}</strong> {transactions[labelIdx]} {transactions[valueIdx]} {transactions[currencyIdx]}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function TransactionCards(props: Props) {
  const classes = useStyles();
  const { transactions, transactionHeaders } = props;
  return (
    <Grow in={transactions && transactions.length}>
      <Grid className={classes.root} container spacing={1}>
        {transactions && transactions.length && transactions.map((transaction: any, idx: number) => (
          <TransactionCard key={idx} transactions={transaction} headers={transactionHeaders} classes={classes} />
        )).reverse()}
      </Grid>
    </Grow>
  );
}
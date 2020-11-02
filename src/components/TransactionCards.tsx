import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: 50
  },
  item: {
    fontSize: 14,
    margin: 0
  },
  button: {
    margin: 0,
    background: "white",
    "&:hover, &:focus": {
      background: "white"
    }
  },
  box: {
    width: "100%",
    margin: 0,
    padding: 0
  },
  date: {
    fontWeight: 700
  },
  content: {
    paddingTop: 25
  },
  inactiveContent: {
    paddingTop: 25,
    background: "grey"
  }
});

interface Props {
  transactions: any;
  transactionHeaders: any;
  excludedTransactions: any,
  includeTransaction: any,
  excludeTransaction: any,
  monthIdx: number
}

function TransactionCard(props: any) {
  const { headers, transactions, onClick, excluded, classes } = props;
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  const labelIdx = headers.indexOf("Rubrik");
  const currencyIdx = headers.indexOf("Valuta");
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent className={excluded ? classes.inactiveContent : classes.content}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row">
            <Typography className={classes.item}>
              <strong>{transactions[dateIdx]}</strong>
            </Typography>
            <Typography className={classes.item}>
              {transactions[labelIdx]}
            </Typography>
            <Typography className={classes.item}>
              {transactions[valueIdx]} {transactions[currencyIdx]}
            </Typography>
            <Button variant="outlined" onClick={onClick} className={classes.button}>{excluded ? "Include" : "Exclude"}</Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function TransactionCards(props: Props) {
  const classes = useStyles();
  const { transactionHeaders, transactions, excludedTransactions, excludeTransaction, includeTransaction, monthIdx } = props;
  return (
    <Grow in={!!(transactions && transactions.length)}>
      <Grid className={classes.root} container spacing={1}>
        {transactions && transactions.length && transactions.map((transaction: any, idx: number) => {
          return <TransactionCard key={idx} transactions={transaction} headers={transactionHeaders} classes={classes} onClick={() => excludedTransactions.includes(idx) ? includeTransaction(monthIdx, idx) : excludeTransaction(monthIdx, idx)} excluded={excludedTransactions.includes(idx)}/>;
        }).reverse()}
      </Grid>
    </Grow>
  );
}
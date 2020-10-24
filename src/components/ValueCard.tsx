import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grow from "@material-ui/core/Grow";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: 250
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface Props {
  label: String;
  amount: number;
  currency: String;
  textColor?: "inherit" | "initial" | "textSecondary" | "primary" | "secondary" | "textPrimary" | "error";
}

function prettyAmount(amount: number): String {
  let strAmount = amount.toString();
  return strAmount.length > 3 ? strAmount.slice(0, strAmount.length - 3) + " " + strAmount.slice(strAmount.length - 3) : strAmount;
}

export default function ValueCard(props: Props) {
  const classes = useStyles();
  const { label, amount, currency, textColor } = props;
  return (
    <Grow in={amount !== 0}>
      <Card className={classes.root} color="error">
        <CardContent>
          <Typography className={classes.title} color={textColor || "textSecondary"}>
            {label}
          </Typography>
          <Typography variant="h5" component="h2">
            {prettyAmount(amount)} {currency}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
}
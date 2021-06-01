import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React from "react";

const useStyles = makeStyles({
  root: {
    width: 250,
    position: "relative"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  compareTextPos: {
    position: "absolute",
    color: "green",
    top: 10,
    right: 10
  },
  compareTextNeg: {
    position: "absolute",
    color: "red",
    top: 10,
    right: 10
  }
});

interface Props {
  label: String;
  amount: number;
  avgAmount?: number;
  currency: String;
  lowerIsBetter?: Boolean,
  textColor?: "inherit" | "initial" | "textSecondary" | "primary" | "secondary" | "textPrimary" | "error";
}

function prettyAmount(amount: number): String {
  let strAmount = amount.toString();
  return strAmount.length > 3 ? strAmount.slice(0, strAmount.length - 3) + " " + strAmount.slice(strAmount.length - 3) : strAmount;
}

export default function ValueCard(props: Props) {
  const classes = useStyles();
  const { label, amount, avgAmount, currency, textColor, lowerIsBetter } = props;
  const changedAmount = amount - (avgAmount || 0);
  if (amount === 0) {
    return null;
  }

  return (
    <Grid item>
      <Grow in>
        <Card className={classes.root} color="error">
          <CardContent>
            {avgAmount ? (
              <Typography className={(lowerIsBetter ? changedAmount <= 0 : changedAmount >= 0) ? classes.compareTextPos : classes.compareTextNeg}>
                <Box display="flex" flexDirection="row" alignItems="center" component="title">{(changedAmount === 0 && lowerIsBetter) || changedAmount < 0 ? <ArrowDownIcon /> : <ArrowUpIcon />} {prettyAmount(Math.abs(changedAmount))}</Box>
              </Typography>
            ) : <></>
            }
            <Typography className={classes.title} color={textColor || "textSecondary"}>
              {label}
            </Typography>
            <Typography variant="h5" component="h2">
              {prettyAmount(amount)} {currency}
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Grid>
  );
}
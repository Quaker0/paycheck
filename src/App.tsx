import React, { Component } from "react";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import "./App.css";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { calcMonthCosts, calcMonthTotals, parseMonthlyTransactions, parseCostTransactions, TransactionTotals} from "./transactionHelpers";
import { ArgumentAxis, ValueAxis, Chart, LineSeries } from "@devexpress/dx-react-chart-material-ui";
import OverviewCards from "./components/OverviewCards";
import TransactionCards from "./components/TransactionCards";

const styles = (theme: any) => ({
  root: {
    backgroundColor: "#282c34",
    padding: 50
  }
});

export const theme = createMuiTheme({
  palette: {
    primary: { main: "#282c34" },
  },
  typography: {
    h1: { color: "#fff", fontSize: 70, fontWeight: 100 }
  }
});

interface Props {
  classes: any;
}

interface State {
  classes: any;
  transactions: Array<Array<String>>;
  monthlyTransactions: any;
  currentMonthCosts: any;
  currentMonthTotals: TransactionTotals;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { classes } = this.props;
    this.state = {transactions: [], classes: classes, monthlyTransactions: [], currentMonthCosts: [], currentMonthTotals: {cost: 0, revenue: 0, currency: ""}};
    this.loadTransactions = this.loadTransactions.bind(this)
  }

  onDragOver = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragEnter = (event: any) => {
    event.stopPropagation();
  }

  onFileDrop = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    
    const file = event.dataTransfer.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => this.loadTransactions(fileReader.result)
  }

  loadTransactions(dataset: any) {
    const transactions = dataset.split("\n").map((data: any) => data.split(";"));
    const monthlyTransactions = parseMonthlyTransactions(transactions);
    const monthlyCostTransaction = parseCostTransactions(transactions[0], monthlyTransactions[0]);
    const currentMonthTotals = calcMonthTotals(transactions[0], monthlyTransactions[0]);
    const currentMonthCosts = calcMonthCosts(transactions[0], monthlyCostTransaction);
    this.setState({transactions: transactions, monthlyTransactions: monthlyTransactions, currentMonthCosts: currentMonthCosts, currentMonthTotals: currentMonthTotals})
  }

  render() {
    const { classes, transactions, monthlyTransactions, currentMonthCosts, currentMonthTotals } = this.state;


    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root} 
          onDrop={this.onFileDrop}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
        >
        
          <Box height="80px" justifyContent="center" alignItems="center" alignContent="center">
            <Typography variant="h1" align="center"> 
              Paycheck
            </Typography>
          </Box>

          <OverviewCards classes={classes} currentMonthTotals={currentMonthTotals} />

          <Paper className={classes.paper}>
            <Chart data={currentMonthCosts}>
              <ArgumentAxis showLine showTicks/>
              <ValueAxis showLine showTicks/>
              <LineSeries valueField="value" argumentField="date" />
            </Chart>
          </Paper>

          <TransactionCards transactionHeaders={transactions[0]} transactions={monthlyTransactions[0] && monthlyTransactions[0].transactions} />
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(App);

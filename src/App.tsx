import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import { ArgumentAxis, Chart, LineSeries, ValueAxis } from "@devexpress/dx-react-chart-material-ui";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Typography from "@material-ui/core/Typography";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ClearIcon from "@material-ui/icons/Clear";
import React, { Component } from "react";
import "source-map-support/register";
import OverviewCards from "./components/OverviewCards";
import TransactionCards from "./components/TransactionCards";
import { calcMonthCosts, calcMonthTotals, calculateRecurring, parseCostTransactions, parseMonthlyTransactions, TransactionTotals } from "./transactionHelpers";

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
  transactionHeaders: Array<String>;
  monthlyTransactions: any;
  currentMonthCosts: any;
  monthTotals: Array<TransactionTotals>;
  monthlyRecurring: any;
  excludedTransactions: Array<number>;
  hoverFile: Boolean;
  stoppedHover: any;
  selectedMonthIdx: number;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.originalState();
    this.loadTransactions = this.loadTransactions.bind(this);
    this.loadTransactionCalcs = this.loadTransactionCalcs.bind(this);
    this.excludeTransaction = this.excludeTransaction.bind(this);
    this.includeTransaction = this.includeTransaction.bind(this);
    this.updateMonthlyTransaction = this.updateMonthlyTransaction.bind(this);
    this.updateSelectedMonthIndex = this.updateSelectedMonthIndex.bind(this);
  }

  originalState = () => {
    return { transactionHeaders: [], selectedMonthIdx: 0, classes: this.props.classes, monthlyTransactions: [], currentMonthCosts: [], monthTotals: [{ cost: 0, revenue: 0, currency: "" }], monthlyRecurring: { monthlyTotals: [0], currency: "" }, excludedTransactions: [], hoverFile: false, stoppedHover: null }
  }

  onDragOver = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    if (!this.state.hoverFile || !this.state.stoppedHover) {
      this.setState({ hoverFile: true, stoppedHover: null })
    }
  }

  onDragEnter = (event: any) => {
    event.stopPropagation();
    if (!this.state.hoverFile || !this.state.stoppedHover) {
      this.setState({ hoverFile: true, stoppedHover: null })
    }
  }

  onDragLeave = (event: any) => {
    event.stopPropagation();
    this.setState({ stoppedHover: Date.now() })
    setTimeout(() => this.state.stoppedHover && Date.now() - this.state.stoppedHover > 800 && this.setState({ hoverFile: false }), 1000);
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
    this.setState({ transactionHeaders: transactions[0], monthlyTransactions, excludedTransactions: [] });
    this.loadTransactionCalcs(transactions[0], monthlyTransactions);
  }

  loadTransactionCalcs(transactionHeaders: Array<String>, monthlyTransactions: any, monthIdx: number = 0) {
    const currentCostTransactions = parseCostTransactions(transactionHeaders, monthlyTransactions[monthIdx]);
    const currentMonthCosts = calcMonthCosts(transactionHeaders, currentCostTransactions);

    const monthTotals = calcMonthTotals(transactionHeaders, monthlyTransactions);
    const monthlyRecurring = calculateRecurring(transactionHeaders, monthlyTransactions)

    this.setState({ currentMonthCosts: currentMonthCosts, monthTotals: monthTotals, monthlyRecurring: monthlyRecurring });
  }

  excludeTransaction(monthIdx: number, transactionIdx: number) {
    let excludedTransactions = this.state.excludedTransactions.concat([transactionIdx]);
    this.setState({ excludedTransactions: excludedTransactions });
    this.updateMonthlyTransaction(monthIdx, excludedTransactions)
  }

  includeTransaction(monthIdx: number, transactionIdx: number) {
    let excludedTransactions = this.state.excludedTransactions.filter((x: number) => x !== transactionIdx);
    this.setState({ excludedTransactions: excludedTransactions });
    this.updateMonthlyTransaction(monthIdx, excludedTransactions)
  }

  updateMonthlyTransaction(monthIdx: number, excludedTransactions: Array<number>) {
    const { transactionHeaders, monthlyTransactions } = this.state;
    let monthlyTransactionsCopy = monthlyTransactions.slice()
    let monthTransactionsCopy = monthlyTransactionsCopy[monthIdx].transactions.slice();
    excludedTransactions.forEach(idx => { monthTransactionsCopy.splice(idx, 1) });
    monthlyTransactionsCopy[monthIdx] = { salary: monthlyTransactions[monthIdx].salary, transactions: monthTransactionsCopy }
    this.loadTransactionCalcs(transactionHeaders, monthlyTransactionsCopy, monthIdx);
  }

  updateSelectedMonthIndex(increase: boolean) {
    const { transactionHeaders, monthlyTransactions, selectedMonthIdx } = this.state;
    const newMonthIdx = increase ? selectedMonthIdx - 1 : selectedMonthIdx + 1;
    this.loadTransactionCalcs(transactionHeaders, monthlyTransactions, newMonthIdx);
    this.setState({ selectedMonthIdx: newMonthIdx })
  }

  render() {
    const { classes, transactionHeaders, monthlyTransactions, currentMonthCosts, monthTotals, monthlyRecurring, excludedTransactions, hoverFile, selectedMonthIdx } = this.state;
    return (
      <ThemeProvider theme={theme}>
        {
          monthlyTransactions.length ? (
            <>
              <Box position="absolute" top={20} right={20}>
                <Button disabled={selectedMonthIdx >= monthlyTransactions.length - 1} style={{ margin: 10 }} onClick={() => this.updateSelectedMonthIndex(false)} variant="contained"><ChevronLeft /></Button>
                <Button disabled={selectedMonthIdx <= 0} style={{ margin: 10 }} onClick={() => this.updateSelectedMonthIndex(true)} variant="contained"><ChevronRight /></Button>
                <Button style={{ margin: 10 }} onClick={() => this.setState(this.originalState())} variant="contained"><ClearIcon /></Button>
              </Box>
              <Box position="absolute" top={60} right={120}>
                <p style={{ color: 'white', textTransform: 'capitalize' }}>{monthlyTransactions[selectedMonthIdx].period}</p>
              </Box>
            </>
          ) : <></>
        }
        <div className={classes.root}
          onDrop={this.onFileDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
        >

          <Box height="80px" justifyContent="center" alignItems="center" alignContent="center">
            <Typography variant="h1" align="center">
              Paycheck
            </Typography>
          </Box>

          <OverviewCards classes={classes} monthTotals={monthTotals} monthlyRecurring={monthlyRecurring} monthIdx={selectedMonthIdx} />
          {
            !monthlyTransactions.length ?
              <Box color={hoverFile ? "success.main" : "text.secondary"}><Typography variant="h5" align="center">Drag and drop your csv transaction file here</Typography></Box>
              : <></>
          }
          {currentMonthCosts.length ? (
            <Paper>
              <Chart data={currentMonthCosts} height={400}>
                <ArgumentAxis showLine showTicks />
                <ValueAxis showLine showTicks />
                <LineSeries valueField="value" argumentField="date" />
              </Chart>
            </Paper>
          ) : <></>
          }

          <TransactionCards transactionHeaders={transactionHeaders} transactions={monthlyTransactions[selectedMonthIdx] && monthlyTransactions[selectedMonthIdx].transactions} excludedTransactions={excludedTransactions} excludeTransaction={this.excludeTransaction} includeTransaction={this.includeTransaction} monthIdx={selectedMonthIdx} />
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(App);

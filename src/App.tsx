import React, { Component } from "react";
import "source-map-support/register"
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { calcMonthCosts, calcMonthTotals, parseMonthlyTransactions, parseCostTransactions, TransactionTotals} from "./transactionHelpers";
import { ArgumentAxis, ValueAxis, Chart, LineSeries } from "@devexpress/dx-react-chart-material-ui";
import OverviewCards from "./components/OverviewCards";
import TransactionCards from "./components/TransactionCards";
import ClearIcon from "@material-ui/icons/Clear";

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
  hoverFile: Boolean;
  stoppedHover: any;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.originalState();
    this.loadTransactions = this.loadTransactions.bind(this)
  }

  originalState = () => {
    return {transactions: [], classes: this.props.classes, monthlyTransactions: [], currentMonthCosts: [], currentMonthTotals: {cost: 0, revenue: 0, currency: ""}, hoverFile: false, stoppedHover: null}
  }

  onDragOver = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    if (!this.state.hoverFile || !this.state.stoppedHover) {
      this.setState({hoverFile: true, stoppedHover: null})
    }
  }

  onDragEnter = (event: any) => {
    event.stopPropagation();
    if (!this.state.hoverFile || !this.state.stoppedHover) {
      this.setState({hoverFile: true, stoppedHover: null})
    }
  }

  onDragLeave = (event: any) => {
    event.stopPropagation();
    this.setState({stoppedHover: Date.now()})
    setTimeout(() => this.state.stoppedHover && Date.now() - this.state.stoppedHover > 800 && this.setState({hoverFile: false}), 1000);
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
    const { classes, transactions, monthlyTransactions, currentMonthCosts, currentMonthTotals, hoverFile } = this.state;


    return (
      <ThemeProvider theme={theme}>
        {transactions.length ? <Box position="absolute" top={20} right={20}><Button onClick={() => this.setState(this.originalState())} variant="contained"><ClearIcon/></Button></Box> : <></>}
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

          <OverviewCards classes={classes} currentMonthTotals={currentMonthTotals} />
        { currentMonthCosts.length ? (
          <Paper className={classes.paper}>
            <Chart data={currentMonthCosts}>
              <ArgumentAxis showLine showTicks/>
              <ValueAxis showLine showTicks/>
              <LineSeries valueField="value" argumentField="date" />
            </Chart>
          </Paper>
         ) : <Box color={hoverFile ? "success.main" : "text.secondary"}><Typography variant="h5" align="center">Drag and drop your csv transaction file here</Typography></Box>
        }

          <TransactionCards transactionHeaders={transactions[0]} transactions={monthlyTransactions[0] && monthlyTransactions[0].transactions} />
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(App);

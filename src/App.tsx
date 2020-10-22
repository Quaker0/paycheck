import React, { Component } from "react";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";
import "./App.css";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries
} from "@devexpress/dx-react-chart-material-ui";


const styles = (theme: any) => ({
  root: {
    backgroundColor: "#282c34"
  },
  paper: {
    backgroundColor: "lightgrey"
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


function calcCurrentMonthCosts(transactions: Array<Array<String|Number>>): Array<{date: String, value: Number} | undefined> {
  const headers = transactions[0];
  const dateIdx = headers.indexOf("Bokföringsdag");
  const valueIdx = headers.indexOf("Belopp");
  const labelIdx = headers.indexOf("Rubrik");
  let filteredTransactions = [];
  let salary = 0;
  for (let i = 1; i < transactions.length; i++) {
    if (transactions[i][labelIdx] === "Lön") {
      salary = parseInt(transactions[i][valueIdx].toString());
      break
    }
    else if (transactions[i][valueIdx].toString().startsWith("-")) {
      filteredTransactions.push(transactions[i])
    }
  }

  filteredTransactions = filteredTransactions.sort((a, b) => {
    if (a[dateIdx] === b[dateIdx]) { return 0} ;
    return Date.parse(a[dateIdx].toString()) > Date.parse(b[dateIdx].toString()) ? 1 : -1;
  });

  let totalAmount = salary;
  return filteredTransactions.map(tx => {
    const txValue = parseInt(tx[valueIdx].toString());
    if (txValue > -10000) {
      totalAmount += parseInt(tx[valueIdx].toString());
      return {date: parseInt(tx[dateIdx].toString().split("-")[2]).toString(), value: totalAmount};
    }
    return undefined;
  }).filter(Boolean);
}

interface Props {
  classes: any;
}

interface State {
  classes: any;
  transactions: Array<Array<String>>;
  currentMonthCosts: any;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { classes } = this.props;
    this.state = {transactions: [], classes: classes, currentMonthCosts: []};
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
    const currentMonthCosts = calcCurrentMonthCosts(transactions);
    this.setState({transactions: transactions, currentMonthCosts: currentMonthCosts})
  }

  render() {
    const { classes, currentMonthCosts } = this.state;


    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root} 
          onDrop={this.onFileDrop}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
        >
        
          <Box height="600px" justifyContent="center" alignItems="center" alignContent="center">
            <Typography variant="h1" align="center"> 
              Paycheck
            </Typography>
          </Box>

         <Paper className={classes.paper}>
           <Chart data={currentMonthCosts}>
             <ArgumentAxis showLine showTicks/>
             <ValueAxis showLine showTicks/>
             <LineSeries valueField="value" argumentField="date" />
          </Chart>
        </Paper>
            
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(App);

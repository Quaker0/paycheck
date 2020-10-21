import React, { Component } from 'react';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';

const data = [
  { date: "2020-01-01", value: 10 },
  { date: "2020-01-02", value: 20 },
  { date: "2020-01-03", value: 30 },
];


const styles = (theme: any) => ({
  root: {
    backgroundColor: "#282c34"
  },
  paper: {
    backgroundColor: "ivory"
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

class App extends Component<Props> {

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

    console.log("onFileDrop");
    
    const file = event.dataTransfer.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = function() {
      const dataset = fileReader.result as any;
      const result = dataset.split('\n').map((data: any) => data.split(';'));
      console.log(result);
    };
  }

  render() {
    const { classes } = this.props;
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
           <Chart data={data}>
            <ArgumentAxis />
            <ValueAxis />

            <LineSeries valueField="value" argumentField="date" />
          </Chart>
        </Paper>
            
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(App);

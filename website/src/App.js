import React, { Component } from "react";
import "./App.css";
import styled from "styled-components";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Client from "./client";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CardHeader from '@material-ui/core/CardHeader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';


//import Plot from "react-plotly.js";
//import Plot from "plotly.js-basic-dist";

// client code for socket.io
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8080");

const data = [{ data: 1 }, { data: 2 }];

var totalSum = 0.0;
var totalSquareSum = 0.0;
var totalRecords = 0.0;
var dataSample = [];
const usernames = [
  "",
  "",
  "",
  "",
  "alexramsayer",
  "chrislong",
  "spencerfuhriman",
  "liamcypel"];
const postText = [
  "",
  "",
  "",
  "",
"had a great day today",
"I made some clockarooni sandwiches, you want some?",
"Can't believe I had to eat papa john's instead of little caesars",
"I also made some clockarooni sandwiches, but you can't have any"];

let Plot;
const Section = styled.div`
  width: 100%;
  height: ${props => props.height};
  padding: 15px;
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { data: [], min: 9999999999.0, max: -9999999999.0, average: 0.0, stdv: 0.0, variance: 0.0, isReady: false, completed: 0, postNumber: 0, liked: "default", reset: 0 };

    this.addScript = src => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.type = "text/javascript";
      document.head.appendChild(script);
    };

    //socket.on("eeg", data => console.log(data));
    this.client = new Client("http://localhost:8080");
    //client.start();
    //console.log(client.buffer);
  }

  componentDidMount() {

    if (typeof document !== "undefined") {
      console.log("Plot", Plot);
      this.setState({ isReady: true });
    }

    this.addScript(
      "https://drive.google.com/uc?export=view&id=1jG7w2D0NZIAFJYgtd25FYHT6jcoOY9FJ"
    );

    // BCIDevice.build
    this.addScript(
      "https://drive.google.com/uc?export=view&id=1qLcumUvtlX0vuIeowpVE6qHPDDfS7DjY"
    );

    //bci.js
    this.addScript("https://cdn.jsdelivr.net/npm/bcijs@1.5.2/dist/bci.min.js");
  }



  updateData = recentData => {      //calculates statistical data before passing it along
    const newData = recentData;
    for (var i = 0; i < newData[6].length; i++){
      let n = newData[6][i][1];
      totalRecords += (i + 1);
      if (n > this.state.max){
        this.setState({max: n});
      }
      if (n < this.state.min){
        this.setState({min: n});
      }
  //    console.log("Min:");
  //    console.log(this.state.min);
    //  console.log("Max:");
    //  console.log(this.state.max);
      //console.log(n);
      totalSum += n;
      totalSquareSum += (Math.pow(newData[6][i][1], 2));
      let newavg = totalSum / totalRecords;
      this.setState({ average: newavg });
      if (this.state.reset == 1) {
        this.setState({average: 0.0});
        this.setState({reset: 0});
        this.setState({variance: 0});
        totalSum = 0.0;
        totalRecords = 0.0;
        totalSquareSum = 0.0;
      }
  //    console.log("Average:");
  //    console.log(this.state.average);
      let varia = (totalSquareSum / totalRecords) - (Math.pow((totalSum / totalRecords), 2));
      this.setState({variance: varia})
  //    console.log("Variance:");
  //    console.log(this.state.variance);
      this.setState({stdv: Math.sqrt(varia)})
  //    console.log("Standard Deviation:");
  //    console.log(this.state.stdv);
    }
    //newData[6] contains the Gamma data [timestamp, value]
    //newData[6].length = 65

  //  console.log(newData[6].length);
    this.setState({ data: newData });
  };

  render() {
    //console.log(this.state.data);

    return (

      <Section direction={"column"} className={"bgImage"}>

        <Section direction={"row"} className={"postAndBar"}>


        <Card className={"cardBar"} >
            <CardContent>
              <LinearProgress className={"prog1"} variant="determinate" value={this.state.average}/>
            </CardContent>
          </Card>

          <Card className={"cardContent"}>
            <CardHeader height={"auto"}
              avatar={
                <Avatar aria-label="Recipe">
                  {(usernames[this.state.postNumber]).charAt(0).toUpperCase()}
            </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={usernames[this.state.postNumber]}
              subheader="September 14, 2018"
            />
            <img className={"image"} src={"/img/"+ this.state.postNumber + ".jpg"} />

            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Post Description
              </Typography>
              <Typography component="p">
                {postText[this.state.postNumber]}
              </Typography>

              <Typography className={"value"}>
                {this.state.average}
              </Typography>
            </CardContent>
            <CardActions disableActionSpacing>
              <IconButton className={"like"} aria-label="Add to favorites" color={this.state.liked}>
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="Share" className={"like"}>
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>



        <Fab className={"fab"} variant="extended" aria-label="Next Post" onClick={() => {
          if (this.state.postNumber === 7){
            this.setState({postNumber: 0});
          }
          else {
            this.setState({
              postNumber : this.state.postNumber + 1
            });
          }
          this.setState({
            liked : "default"
          });
          console.log("Average is " + this.state.average);
          this.setState({
            reset : 1
          });
          totalSum = 0.0;
          totalRecords = 0.0;
          totalSquareSum = 0.0;
        }}>
          <AddIcon/>
            Next Post
        </Fab>

        <Fab className={"fab2"} variant="extended" aria-label="Next Post" onClick={() => {
            if(this.state.liked === "secondary") this.setState({
              liked : "default"
            });
            else this.setState({
              liked : "secondary"
            });
        }}>
          <NavigationIcon/>
            Apply Emotion
        </Fab>



        </Section>


        <Section direction={"row"} className={"buttons"}>

        <Button
            variant="contained"
            style={{ margin: "10px", height: "50px", width: "100px" }}
            onClick={() => {
              this.client.connect(this.updateData);
              console.log("connect");}}>
            Connect
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ margin: "10px", height: "50px", width: "100px" }}
            onClick={() => {
              this.client.start();
              console.log("start"); }}>
            Start
          </Button>

          <Button
            variant="contained"
            color="secondary"
            style={{ margin: "10px", height: "50px", width: "100px" }}
            onClick={() => {
              this.client.stop();
              console.log("stop");}}>
            Stop
          </Button>

          </Section>

      </Section>
    );
  }
}

export default App;

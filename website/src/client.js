import openSocket from "socket.io-client";

class Client {
  constructor(address) {
    this.buffer = [];
    this.socket = openSocket(address);
    this.channels = {};
    this.formattedData = [];
    this.SECONDS = 0.25;
    this.stopData = true;
    this.sampleRate = 256;
    this.BUFFER_SIZE = this.SECONDS * this.sampleRate;
    //console.log(this.BUFFER_SIZE);
    this.device = null;
  }

  stop = () => {
    this.stopData = true;
    console.log("STOP");
  };

  start = () => {
    this.stopData = false;
  };

  addData = (sample, channel) => {
    console.log("This is being called")
    if (!this.channels[channel]) this.channels[channel] = [];
    var t = new Date().getTime();
    //for (var i in sample) {
    if (this.channels[channel].length > this.BUFFER_SIZE) {
      this.channels[channel].shift();
    }
    //console.log(this.channels);
    this.channels[channel].push([t++, sample * 1000000]);
    //}
    //this.getBandPower(0, 1);
    //window.channels = this.channels;
  };

  connect = async updateData => {
    await this.socket.on("eeg", data => {
      if (!this.stopData) updateData(data["msg"]);
    });
  };
}
export default Client;

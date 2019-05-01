const Muse = (() => {
  this.buffer = [];
  this.channels = {};
  this.formattedData = [];
  this.SECONDS = 6;
  this.sampleRate = 256;
  this.BUFFER_SIZE = this.SECONDS * this.sampleRate;
  console.log(this.BUFFER_SIZE);
  this.device = null;

  this.addData = (sample, channel) => {
    if (!this.channels[channel]) this.channels[channel] = [];
    var t = new Date().getTime();
    for (var i in sample) {
      if (this.channels[channel].length > this.BUFFER_SIZE) {
        this.channels[channel].shift();
      }

      this.channels[channel].push([t++, sample[i]]);
    }
    this.getBandPower(0, 1);
    window.channels = this.channels;
  };

  this.updateFormattedData = () => {
    for (var channel in this.channels) {
      this.getFormattedChannelData(channel);
    }
  };

  this.getFormattedChannelData = channel => {
    for (var reading in this.channels[channel]) {
      //console.log(reading, this.channels[channel][reading]);
    }
  };

  this.getBandPower = (start, stop) => {
    let channelPower = {};
    for (var channel in this.channels) {
      channelPower[channel] = window.bci.signalBandPower(
        this.channels[channel],
        this.sampleRate,
        [start, stop]
      );
    }

    return channelPower;
  };

  this.startMuse = updateData => {
    this.device = new window.BCIDevice({
      dataHandler: sample => {
        let { electrode, data } = sample;
        this.addData(data, electrode);
        updateData(this.channels);
        console.log(sample);
        //this.updateFormattedData();
      }
    });
    this.device.connect();
  };

  return this;
})();

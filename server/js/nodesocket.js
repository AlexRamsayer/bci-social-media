/** Class used to manage connection with node server. 
 * @class
*/

var NodeSocket = function() {
	this.socket = io();
	this.alpha = 0
	this.beta = 0

	this.getBeta = function(){
		return this.beta;
	}

	this.setBeta= function(val){
		this.beta = val; 
	}

	this.socket.on('channel1', function(packet) {
		socket.setBeta(packet.msg[5])
	})
}


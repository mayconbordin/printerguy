'use strict';
var SerialPort = require('serialport');

var Serial = function(conn) {
    var path;
    
    if (typeof(a) == 'object') {
        path = conn.comName;
    } else {
        path = conn;
    }
    
    this.port = new SerialPort(path);
};

Serial.prototype.open = function(callback) {
    this.port.open(function (err) {
      if (err) {
        console.log('Error opening port: ', err.message);
      }
    });
    
    // the open event will always be emitted
    this.port.on('open', callback);
    
    return this;
};

Serial.prototype.write = function(data, callback) {
    this.port.write(data, callback);
};

Serial.list = function(callback) {
    SerialPort.list(function (err, ports) {
        if (err) {
            console.log('Error opening port: ', err.message);
        } else {
            callback(ports);
        }
    });
};
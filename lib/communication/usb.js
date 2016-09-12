'use strict';
const usb = require('usb');

/**
 * [USB Class Codes ]
 * @type {Object}
 * @docs http://www.usb.org/developers/defined_class
 */
const CLASS_CODE = {
  AUDIO  : 0x01,
  HID    : 0x03,
  PRINTER: 0x07,
  HUB    : 0x09
};

/**
 * [function USB]
 * @param  {[type]} vid [description]
 * @param  {[type]} pid [description]
 * @return {[type]}     [description]
 */
var USB = function(vid, pid) {
  if (vid && pid) {
    this.device = usb.findByIds(vid, pid);
  } else {
    this.device = USB.findPrinter();
  }

  if (!this.device) {
    throw new Error('Can not find printer');
  }

  return this;
};

/**
 * [open description]
 * @return {[type]} [description]
 */
USB.prototype.open = function(callback) {
  var self = this;
  this.device.open();

  this.device.interfaces.forEach(function(iface) {
    if (iface.isKernelDriverActive()) {
      try {
        iface.detachKernelDriver();
      } catch(e) {
        console.error("[ERROR] Could not detatch kernel driver: %s", e)
      }
    }

    iface.claim();

    iface.setAltSetting(iface.altSetting, function() {
      iface.endpoints.filter(function(endpoint) {
        if (endpoint.constructor.name == 'OutEndpoint') {
          self.endpoint = endpoint;
          callback && callback(null, self);
        }
      });

      if (!self.endpoint) {
        callback && callback(new Error('Can not find endpoint from printer'));
      }
    });
  });

  return this;
};

/**
 * [function write]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
USB.prototype.write = function(data, callback) {
  console.log(this.endpoint);
  this.endpoint.transfer(data, callback);
};

/**
 * [findPrinter description]
 * @return {[type]} [description]
 */
USB.findPrinter = function() {
  var devices = usb.getDeviceList();
  var printers = [];

  devices.map(function(device) {
    device.configDescriptor.interfaces.map(function(iface) {
        iface.map(function(i) {
          if (i.bInterfaceClass == CLASS_CODE.PRINTER) {
            printers.push(device);
          }
        });
    });
  });

  return (printers.length > 0) ? printers[0] : null;
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = USB;

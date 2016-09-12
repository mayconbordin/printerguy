var USB = require('../../lib/communication/usb'),
  PPLA = require('../../lib/interface/ppla');

exports.findPrinter = function (test) {
  var printer = USB.findPrinter();

  test.ok(printer != null);
  test.done();
};

exports.connect = function (test) {
  var usb = new USB(/*5732, 314*/);
  usb.open(function() {
      usb.write('test', function(err) {
        console.log('error: ' + err);
      });
  });

  test.done();
};

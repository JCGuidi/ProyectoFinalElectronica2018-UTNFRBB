var util = require('util');
var bleno = require('../..');
var i2c = require('i2c');
var address = 0x04;
var wire = new i2c(address, {device: '/dev/i2c-1'});
var readValue = 0;
var myVar = 0;
var BlenoCharacteristic = bleno.Characteristic;
var threshold = 100;
var configuration = 5;

var Gpio = require('pigpio').Gpio,
  menique = new Gpio(17, {mode: Gpio.OUTPUT}),
  anular = new Gpio(27, {mode: Gpio.OUTPUT}),
  medio = new Gpio(22, {mode: Gpio.OUTPUT}),
  indice = new Gpio(10, {mode: Gpio.OUTPUT}),
  palma = new Gpio(9, {mode: Gpio.OUTPUT}),
  pulgar = new Gpio(11, {mode: Gpio.OUTPUT}),
  led = new Gpio(5, {mode: Gpio.OUTPUT}),
  pulseWidth = 1000;

led.digitalWrite(1);

//Agregar tiempos, control posicion blablabla
function palmaAbierta() {
  menique.servoWrite(2400);
  anular.servoWrite(600);
  medio.servoWrite(2400);
  indice.servoWrite(770);
  pulgar.servoWrite(2400);
  palma.servoWrite(1420);
}
function fuckYou() {
  menique.servoWrite(600);
  anular.servoWrite(2400);
  medio.servoWrite(2400);
  indice.servoWrite(2400);
  pulgar.servoWrite(2100);
  setTimeout(function(){palma.servoWrite(1050);}, 200);
  setTimeout(function(){pulgar.servoWrite(1925);}, 200);
}
function paz() {
  menique.servoWrite(600);
  anular.servoWrite(2400);
  medio.servoWrite(2400);
  indice.servoWrite(770);
  setTimeout(function(){palma.servoWrite(1080);}, 200);
  setTimeout(function(){pulgar.servoWrite(1600);}, 200);
}
function senalar() {
  menique.servoWrite(600);
  anular.servoWrite(2400);
  medio.servoWrite(600);
  indice.servoWrite(770);
  setTimeout(function(){palma.servoWrite(1080);}, 200);
  setTimeout(function(){pulgar.servoWrite(1780);}, 200);
}
function queonda() {
  menique.servoWrite(2400);
  anular.servoWrite(2400);
  medio.servoWrite(600);
  indice.servoWrite(2400);
  pulgar.servoWrite(2400);
  palma.servoWrite(1420);
}
function cerrada(){
  menique.servoWrite(600);
  anular.servoWrite(2400);
  medio.servoWrite(600);
  indice.servoWrite(2400);
  pulgar.servoWrite(2100);
  setTimeout(function(){palma.servoWrite(1050);}, 200);
  setTimeout(function(){pulgar.servoWrite(1925);}, 200);
}

function myFunc() {
  wire.read(1, function(err, res) {
   readValue = res[0];
   if (readValue > threshold) {
     switch (configuration) {
       case 1:
         console.log("FuckYou");
         //🖕🏻:
         setTimeout(fuckYou, 500);
         break;
       case 2:
         console.log("HLVS");
         //✌🏼:
         setTimeout(paz, 500);
         break;
       case 3:
         console.log("mira");
         //👆🏻:
         setTimeout(senalar, 500);
         break;
       case 4:
         console.log("que ondaaa");
         //🤙:
         setTimeout(queonda, 500);
         break;
       case 5:
         console.log("awantaa");
         //
         cerrada()
         break;
       default:
         console.log("awantaaE");
         //✋:
         palmaAbierta()
     }
   } else {
     palmaAbierta();
   }
  });
}

var EchoCharacteristic = function() {
  EchoCharacteristic.super_.call(this, {
    uuid: 'ec0e',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('EchoCharacteristic - onReadRequest: value = ' + this._value);

  callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  //Si mando algo desde la app, para cambiar la posicion
  if (data < 10) {
    switch (Math.floor(data)) {
      case 1:
        console.log("FuckYou");
        configuration = 1;
        // palmaAbierta();
        // //🖕🏻:
        // setTimeout(fuckYou, 500);
        break;
      case 2:
        console.log("HLVS");
        configuration = 2;
        // //✌🏼:
        // palmaAbierta();
        // setTimeout(paz, 500);
        break;
      case 3:
        console.log("mira");
        configuration = 3;
        // //👆🏻:
        // palmaAbierta();
        // setTimeout(senalar, 500);
        break;
      case 4:
        console.log("que ondaaa");
        configuration = 4;
        // //🤙:
        // palmaAbierta();
        // setTimeout(queonda, 500);
        break;
      case 5:
        console.log("awantaa");
        configuration = 5;
        // //✋
        // palmaAbierta()
        break;
      default:
        console.log("awantaaE");
        configuration = 5;
        //✋:
        // palmaAbierta()
    }
  } else if (data > 250) {
    switch (Math.floor(data/10000) ) {
      case 1:
        menique.servoWrite(data%10000);
        break;
      case 2:
        anular.servoWrite(data%10000);
        break;
      case 3:
        medio.servoWrite(data%10000);
        break;
      case 4:
        indice.servoWrite(data%10000);
        break;
      case 5:
        pulgar.servoWrite(data%10000);
        break;
      case 6:
        palma.servoWrite(data%10000);
        break;
      default:
        console.log("awantaa");
        //✋: 2300 - 700 - 2400 - 600 - p1300 - b1400
        menique.servoWrite(2300);
        anular.servoWrite(700);
        medio.servoWrite(2400);
        indice.servoWrite(600);
        pulgar.servoWrite(2100);
        palma.servoWrite(1300);
    }
  } else {
    threshold = data
  }

  console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value);

  if (this._updateValueCallback) {
    console.log('EchoCharacteristic - onWriteRequest: notifying');

    //this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('EchoCharacteristic - onSubscribe');
  myVar = setInterval(myFunc, 100);
  this.changeInterval = setInterval(function() {
    var data = new Buffer(2);
    data.writeUInt16LE(readValue, 0);
    //console.log('IndicateOnlyCharacteristic update value:' + readValue);
    updateValueCallback(data);
  }.bind(this), 100);

  this._updateValueCallback = updateValueCallback;
};

EchoCharacteristic.prototype.onUnsubscribe = function() {
  console.log('EchoCharacteristic - onUnsubscribe');
  clearInterval(myVar);
  if (this.changeInterval) {
    clearInterval(this.changeInterval);
    this.changeInterval = null;
  }

  this._updateValueCallback = null;
};

module.exports = EchoCharacteristic;

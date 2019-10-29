const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const robot = require('robotjs');

const parser = new Readline();

SerialPort.list(function(err, ports) {
	var arduinos = ports.filter(isArduino);
	if (arduinos.length !== 0) {
		connect(
			arduinos[0].comName,
			9600
		);
	} else {
		console.log('No Arduino detected…');
	}
});

function isArduino(port) {
	pm = port['manufacturer'];
	return pm !== undefined && pm.includes('arduino');
}

function connect(comName, baudRate) {
	console.log(`Opening port ${comName} at ${baudRate}…`);
	var port = new SerialPort(comName, { baudRate: baudRate });
	port.pipe(parser);
}

const lookup = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'alt', 'ctrl', 'space', 'shift', 'enter', 'space', 'up', 'down', 'left', 'right'];

var keys = [];

parser.on('data', line => {
	line = line.trim();

	var key = line.substr(1);

	var first = line[0];

	if (first === '$') {
		if (lookup.includes(key) && !keys.includes(key)) {
			pressKey(key, 1);
			keys.push(key);
		}
	}

	if (first === '!') {
		keys = keys.filter(k => k !== key);
	}
});

function pressKey(key, count) {
	console.log(`key: ${key}`);

	for (var i = 0; i < count; i++) {
		robot.keyToggle(key, 'down');
	}
	for (var i = 0; i < count; i++) {
		robot.keyToggle(key, 'up');
	}
}

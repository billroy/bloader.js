//
// bloader.js: node.js-based file loader and command line shell for arduino
//
//	Copyright 2012 Bill Roy (MIT License)
//

////////////////////
//
// Parse the options
//
var opt = require('optimist');
var argv = opt.usage('Usage: $0 [flags]')
	.alias('p', 'port')
	.describe('p', 'virtual serial port name (auto-detects FTDI ports on Mac/Linux)')
	.alias('b', 'baud')
	.describe('b', 'virtual serial port baud rate')
	.alias('f', 'file')
	.describe('f', 'file to send')
	.alias('r', 'repeat')
	.describe('r', 'interval to re-send file (seconds)')
	.argv;

if (argv.help) {
	opt.showHelp();
	process.exit();
} 


////////////////////
//
// Which serial port?
//
shell = require("shelljs");
var portlist, portname;

if (argv.port) portlist = [argv.port];
else if (process.platform === 'darwin') portlist = shell.ls("/dev/tty.usb*");
else if (process.platform === 'linux') portlist = shell.ls("/dev/ttyUSB*");

if (portlist.length == 0) {
	process.stdout.write('No ports found.\n');
	process.exit(-1);
}
else if (portlist.length > 1) {
	process.stdout.write('Trying first of multiple ports:\n' + portlist.join('\n'));
}
portname = portlist[0];


////////////////////
//
// Open serial port
//
var SerialPort = require('serialport').SerialPort;
try {
	var port = new SerialPort(portname, {
		baudrate: argv.baud || 57600,
		buffersize: 20480
	});
} catch(e) {
	process.stdout.write('Cannot open serial device.');
	process.exit(-2);
}


////////////////////
//
// Serial port listener
//
var lines;		// array of commands to send to target

port.on('data', function(data) {	// port input goes to stdout
	process.stdout.write(data);

	// when we see the prompt go by, send the next command if we have one
	if (lines && lines.length && data.toString().match("\n> ")) {
		var line = lines.shift();
		port.write(line + '\n');
	}
});


////////////////////
//
// Send file
//
var fs = require('fs');
function sendFile(filename) {
	var filetext = fs.readFileSync(argv.file, 'utf8');		// specifying 'utf8' to get a string result
	lines = filetext.split('\n');
	port.write('\n');	// get a prompt
}

if (argv.file) {
	sendFile(argv.file);
	if (argv.repeat) setInterval(sendFile, argv.repeat*1000, argv.file);
}


////////////////////
//
// Enter terminal mode
//
if (port) {
//	port.on('data', function(data) {	// port input goes to stdout
//		process.stdout.write(data);
//	});
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.setRawMode(true);			// pass ^C through to serial port
	process.stdin.on('data', function (data) {	// keyboard input goes to port
		if (data === '\x1d') process.exit(0);	// ^] to quit
		else if (port) port.write(data);
	});
}
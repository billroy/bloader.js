bloader.js
==========

Bitlash serial program loader for Arduino / usbserial.

Transmits a file you specify, one line at at time, to Bitlash over the usb serial port.

The file can be function definitions or live commands to execute.  Same thing, right?

At the end of the file it drops you into interactive mode so you can talk to the Bitlash via the terminal.

If you specify the -r option the file will be sent over and over again at the specified interval.  In this case you don't get a terminal.


## Requirements

- node.js and npm from http://nodejs.org

- Build tools: The node-serialport module install requires a compiler; see this link for build tool requirements for your platform:

	https://github.com/voodootikigod/node-serialport


# Install

	> git clone https://github.com/billroy/bloader.js.git
	> cd bloader
	> npm install

## Usage

	> node bloader --help
	Usage: node ./bloader [flags]
	
	Options:
		-p, --port    virtual serial port name (auto-detects FTDI ports on Mac/Linux)
		-b, --baud    virtual serial port baud rate                                  
		-f, --file    file to send                                                   
		-r, --repeat  interval to re-send file (seconds)    

To exit, type Control+].
  
## Examples

Go straight to interactive mode:

	> node bloader

Load a file, drop into interactive mode:

	> node bloader -f testfile

Send a file every 10 seconds

	> node bloader -f lcdupdate -r 10

bloader.js
==========

Bitlash serial program loader for Arduino / usbserial.

Transmits a file (which can be local or the contents of a given web URL) you specify, one line at at time, to Bitlash over the usb serial port.

The file can be function definitions or live commands to execute.  Same thing, right?

At the end of the file it drops you into interactive mode so you can talk to the Bitlash via the terminal.

If you specify the -r option the file will be sent over and over again at the specified interval.  In this case you don't get a terminal.


## Requirements

- node.js and npm from http://nodejs.org

- Build tools: The node-serialport module install requires a compiler; see this link for build tool requirements for your platform:

	https://github.com/voodootikigod/node-serialport


# Install

	> sudo npm install bloader -g

## Usage

	> bloader --help
	Usage: node ./bloader [flags]
	
	Options:
		-p, --port    virtual serial port name (auto-detects FTDI ports on Mac/Linux)
		-b, --baud    virtual serial port baud rate                                  
		-f, --file    file to send                                                   
		-r, --repeat  interval to re-send file (seconds)    

To exit, type Control+].
  
## Examples

Go straight to interactive mode:

	> bloader

Load a file, drop into interactive mode:

	> bloader -f testfile

Load a file over the web

	> bloader -f http://example.com/bitlash/testfile

Load the Bitlash elevator example direct from github:

	> bloader -f https://raw.github.com/billroy/bitlash/master/bitlashcode/elevator2.btl

Send a file every 10 seconds

	> bloader -f lcdupdate -r 10

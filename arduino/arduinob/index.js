const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SerialPort } = require('serialport');

// Express app setup
const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

// Connect to Arduino via serial port with error handling
let serialPort;
try {
    serialPort = new SerialPort({
        path: 'COM3', // Replace with your actual port
        baudRate: 9600
    });

    serialPort.on('open', () => {
        console.log('Serial port is open');
    });

    serialPort.on('error', (err) => {
        console.error('Serial port error:', err.message);
    });
} catch (error) {
    console.error('Failed to initialize serial port:', error.message);
    process.exit(1); // Exit the application if the serial port fails to initialize
}

// API endpoint to control the light
app.post('/api/light', (req, res) => {
    const { state } = req.body; // `state` should be "on" or "off"

    if (!serialPort || !serialPort.isOpen) {
        return res.status(500).json({ message: 'Serial port is not open' });
    }

    if (state === 'on') {
        serialPort.write('1', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to send data to Arduino' });
            }
            res.json({ message: 'Light turned on' });
        });
    } else if (state === 'off') {
        serialPort.write('0', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to send data to Arduino' });
            }
            res.json({ message: 'Light turned off' });
        });
    } else {
        res.status(400).json({ message: 'Invalid state' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


//----------------------------------------------------------------------------------------------------
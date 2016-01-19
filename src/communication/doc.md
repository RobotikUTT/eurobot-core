// Utilisation

bool     : 1b
int8/char:
uint8    :
int16    :
uint16   :
float    :

let newSpeedPacket = new communication.SpeedPacket(200); //rpm

CAN : this.moduleXXX.send(Message.CAN(newSpeedPacket)) // return new CANSerializer(newSpeedPacket)
UArt: this.moduleXXX.send(Message.UART(newSpeedPacket)) // return new UARTSerializer(newSpeedPacket)

Module.prototype.send = function (msg) {
    if (Message.isCAN(msg)) { // return msg instanceof CANSerializer
        this.robot.com.send(msg.raw())
    } else if (Message.isUART(msg)) { // return msg instanceof UARTSerializer
        this.com.send(msg.raw())
    }
}

```
import communication from './communication';
import Message from './communication/Message';

let testPacket = new communication.Test(-1);
let message    = Message.UART(testPacket);

let raw = message.raw();
```

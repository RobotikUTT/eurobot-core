```
import communication from './communication';
let com    = new communication.transports.UART(null);
let buffer = com.serializer(new communication.protocol.TestPacket(60)).raw;

console.log(com.parse(buffer));

let com2    = new communication.transports.CANBus(null);
let buffer2 = com2.serializer(new communication.protocol.TestPacket(60)).raw;

console.log(com2.parse(communication.protocol.TestPacket, buffer2));
```

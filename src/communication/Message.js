import CANSerializer from './bus/CAN';
import UARTSerializer from './bus/UART';

export default class Message {
    static CAN(packet) {
        return new CANSerializer(packet);
    }

    static UART(packet) {
        return new UARTSerializer(packet);
    }

    static isCAN(packet) {
        return packet instanceof CANSerializer;
    }

    static isUART(packet) {
        return packet instanceof UARTSerializer;
    }
}

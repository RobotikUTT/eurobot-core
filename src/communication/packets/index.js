import TestPacket from './TestPacket';
import MovePacket from './MovePacket';
import OdometryPacket from './OdometryPacket';


var packetsByNumber = {
    0: TestPacket,
    1: MovePacket,
    2: OdometryPacket
};

export default packetsByNumber;
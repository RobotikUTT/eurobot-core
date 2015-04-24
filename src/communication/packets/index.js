import TestPacket from './TestPacket';
import MovePacket from './MovePacket';
import OdometryPacket from './OdometryPacket';
import MotorStopPacket from './MotorStopPacket';
import MotorRunPacket from './MotorRunPacket';
import EncoderPacket from './EncoderPacket';
import TurnPacket from './TurnPacket';


var packetsByNumber = {
    0: TestPacket,
    1: MovePacket,
    2: OdometryPacket,
    3: MotorStopPacket,
    4: MotorRunPacket,
    5: EncoderPacket,
    6: TurnPacket
};

export default packetsByNumber;
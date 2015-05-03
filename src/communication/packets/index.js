import PingPacket from './PingPacket';
import MovePacket from './MovePacket';
import OdometryPacket from './OdometryPacket';
import MotorStopPacket from './MotorStopPacket';
import MotorRunPacket from './MotorRunPacket';
import EncoderPacket from './EncoderPacket';
import TurnPacket from './TurnPacket';
import SetOdometryPacket from './SetOdometryPacket';
import ResetEncoderPacket from './ResetEncoderPacket';
import TuningsPacket from './TuningsPacket';
import SetModePacket from './SetModePacket';
import ClampGetPosPacket from './ClampGetPosPacket';
import ClampGoToPacket from './ClampGoToPacket';
import ClampStopPacket from './ClampStopPacket';
import ClampInitPacket from './ClampInitPacket';


var packetsByNumber = {
    0: PingPacket,
    1: MovePacket,
    2: OdometryPacket,
    3: MotorStopPacket,
    4: MotorRunPacket,
    5: EncoderPacket,
    6: ResetEncoderPacket,
    7: TurnPacket,
    8: TuningsPacket,
    9: SetOdometryPacket,
    10: SetModePacket,
    0x30: ClampGoToPacket,
    0x31: ClampInitPacket,
    0x32: ClampGetPosPacket,
    0x33: ClampStopPacket,
};

export default packetsByNumber;
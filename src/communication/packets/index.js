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
import SensorsGetPosPacket from './SensorsGetPosPacket';
import StartEntraxePacket from './StartEntraxePacket';
import StopEntraxePacket from './StopEntraxePacket';


var packetsByNumber = {
    0x00: PingPacket,
    0x01: MovePacket,
    0x02: OdometryPacket,
    0x03: MotorStopPacket,
    0x04: MotorRunPacket,
    0x05: EncoderPacket,
    0x06: ResetEncoderPacket,
    0x07: TurnPacket,
    0x08: TuningsPacket,
    0x09: SetOdometryPacket,
    0xA: SetModePacket,
    0xB: StartEntraxePacket,
    0xC: StopEntraxePacket,
    0x30: ClampGoToPacket,
    0x31: ClampInitPacket,
    0x32: ClampGetPosPacket,
    0x33: ClampStopPacket,
    0x50: SensorsGetPosPacket
};

export default packetsByNumber;
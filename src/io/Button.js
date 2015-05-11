import EventEmitter from 'events';
import logger from '../libs/logger';
import GpioPin from '../libs/GpioPin';


let log = logger.getLogger(module)


class Button extends EventEmitter {

    constructor(dataPin, triggerState) {
        if (triggerState !== 'high' && triggerState !== 'low') {
            throw TypeError('triggerState must be either high or low');
        }
        this.dataPin = new GpioPin(dataPin);
        this.triggerState = triggerState;

        setInterval(() => {
            this.dataPin.read()
                .then((level)  => {
                    if (level === this.triggerState) {
                        this.emit('start');
                    }
                });
        }, 20);
    }
}

export default Button;
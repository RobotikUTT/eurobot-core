import { EventEmitter } from 'events';
import * as logger from '../helper/logger';

let log = logger.getLogger(module);

const PING_PERIOD = 3 * 1000; // ms


class Module extends EventEmitter {

    constructor(robot, pingPeriod = PING_PERIOD) {
        super();
        this.bot                 = robot;

        this.pingPeriod          = pingPeriod;
        this.lastPingtime        = 0;
        this.lastValidPacketTime = 0;
        this.alive               = false;
    }

    init() {
        setInterval(() => this.ping(), this.pingPeriod);
        return Promise.resolve();
    }

    ping() {
        // A valid packet has been received => no ping required
        if (this.lastValidPacketTime <= this.lastPingTime + this.pingPeriod) {
            this.lastPingTime = this.lastValidPacketTime;
            return;
        }

        this.bot.com.send()
            .then(() => {
                this.lastPingTime = (new Date()).getTime();

                if (!this.alive) {
                    this.alive = true;
                    this.emit('reconnect');
                }
            })
            .catch((err) => {
                if (this.alive) {
                    this.alive = false;
                    this.emit('disconnect', err);
                }
            });
    }

    isAlive() {
        return this.isAlive();
    }
}


export default Module;

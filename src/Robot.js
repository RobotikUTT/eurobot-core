import { EventEmitter } from 'events';
import Communication from './communication/Communication';
import * as logger from './helper/logger';

let log = logger.getLogger(module);


class Robot extends EventEmitter {

    constructor(comPort) {
        super();
        this.com     = new Communication(comPort);
        this.modules = {};
    }


    init() {
        log.debug('Robot initialization...');
        let promises = [];

        // Init each modules
        for (let moduleName in this.modules) {
            promises.push(this.modules[moduleName].init());
        }

        return Promise.all(promises);
    }


    use(Module) {
        if (typeof Module !== 'function') {
            throw new TypeError('Robot.use() requires a module class ' +
               'but got a ' + typeof Module);
        }

        let module     = new Module(this);
        let moduleName = module.constructor.name;

        this.modules[moduleName] = module;
        log.debug(`Using ${moduleName}`);

        return this;
    }
}


export default Robot;

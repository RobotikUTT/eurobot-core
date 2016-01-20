import 'source-map-support/register';
import 'babel-polyfill';
// import fs from 'fs';
// import Robot from './Robot';
// import MotionController from './module/MotionController';
// import IA from './IA/IA';
// import * as webServer from './controlPanel/webServer';
// import conf from './helper/config';
// import * as logger from './helper/logger';

// let log = logger.getLogger(module);


// let robot = new Robot(conf.get('com').port);

// robot.use(MotionController)
//     .init()
//     .then(function() {
//         log.info('Robot initialized');
//         webServer.start();
//         log.info('WebServer listening on *:8080');
//     })
//     .catch(function(err) {
//         log.error(err);
//     });



import communication from './communication';
let com    = new communication.transports.UART(null);
let buffer = com.serializer(new communication.protocol.TestPacket(60)).raw;

console.log(com.parse(buffer));

let com2    = new communication.transports.CANBus(null);
let buffer2 = com2.serializer(new communication.protocol.TestPacket(60)).raw;

console.log(com2.parse(communication.protocol.TestPacket, buffer2));

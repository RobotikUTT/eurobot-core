import { Sequence } from 'schedulerjs';


export default (robot) => {
    let seq = new Sequence();

    let objective = {};

    seq
        .next(() => robot.turn(0))
        .next(() => robot.goTo(86, 5))
        .next(() => robot.goTo(86, 14))
        .next(() => {
            objective.done = true;
        });

    objective = {
        name: 'door1',
        reward: 10,
        startPoint: { x: 86, y: 14, theta: 0 },
        mapPoint: { x: 8, y: 1 },
        sequence: seq,
    };

    return objective;
};

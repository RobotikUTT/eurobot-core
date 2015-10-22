import { Sequence } from 'schedulerjs';


export default (robot) => {
    let seq = new Sequence();

    let objective = {};

    seq
        .next(() => robot.turn(0))
        .next(() => robot.nets.deploy())
        .next(() => robot.goTo(84, 192))
        .next(() => robot.nets.up())
        .next(() => robot.goTo(92, 192))
        .next(() => robot.nets.drop())
        .next(() => robot.nets.stow())
        .next(() => {
            objective.done = true;
        });

    objective = {
        name: 'door1',
        reward: 10,
        startPoint: { x: 34, y: 192, theta: 0 },
        mapPoint: { x: 3, y: 19 },
        sequence: seq,
    };

    return objective;
};

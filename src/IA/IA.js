import fs from 'fs';
import path from 'path';
import { Sequence } from 'schedulerjs';
import Pathfinding from 'pathfindingjs';
import conf from '../helper/config';
import * as logger from '../helper/logger';
import objectives from './objectives';

let log = logger.getLogger(module);

const MAX_ROUND_TIME = 1000 * 60 * 1.5 - 2000; // 1m30 - padding
const MAP_X_UNIT     = 10; // 1 x-unit = 10mm
const MAP_Y_UNIT     = 10; // 1 y-unit = 10mm


class IA {
    /**
     * Creates the IA and load sequences
     *
     * @param  {Robot} robot The robot
     */
    constructor(robot) {
        this.robot = robot;

        // Map
        this.map    = require('./map');
        this.finder = new Pathfinding(this.map.grid);

        this.finder.setFrom(...this.map.start);

        // Default sequence (optimal)
        this.defaultSequence = new Sequence();
        this.defaultSequence
            .next(this.objectives.door1)
            .next(() => this.goToNext('door2'))
            .next(this.objectives.door2)
            .next(() => this.goToNext('fishing'))
            .next(this.objectives.fishing)
            .next(() => this.robot.stop());

        // On robot blocked, decision making
        this.robot.on('obstacle', () => {
            this.decide();
        });
    }

    /**
     * Inits the IA and starts the default sequence
     */
    init() {
        log.info('Start IA');

        this.defaultSequence.start();

        // Robot should stop after maximum time
        setTimeout(() => {
            this.robot.stop();
            this.robot.sunshade.open();
        }, MAX_ROUND_TIME);
    }

    /**
     * Decides what's best to do when blocked
     */
    decide() {
        let objectivesLeft = Object.keys(this.objectives);
        let length         = objectivesLeft.length;

        // Do not count objectives already made
        for (let objectiveName of objectivesLeft) {
            if (this.objectives[objectiveName].done) {
                --length;
            }
        }

        if (length === 0) {
            // Stop the robot when finished
            this.robot.stop();
            return;
        }

        let maximumScore = -1;
        let maximumObjective;
        let maximumPath;

        for (let objectiveName of objectivesLeft) {
            let objective = this.objectives[objectiveName];

            // Prevent making objectives already done
            if (objective.done) {
                continue;
            }

            // Prevent making post-stop objectives
            if (!objective.mapPoint) {
                continue;
            }

            let { score, path } = this.getObjectiveScore(objective);
            if (score > maximumScore) {
                maximumObjective = objective;
                maximumPath      = path;
            }
        }

        let chosenSequence = this.pathToSequence(path);
        chosenSequence.start();
        chosenSequence.on('finished', () => {
            this.decide();
        });
    }

    /**
     * Converts a map point to to millimeters
     *
     * @param  {Object} point The previous point (containing x and y integers)
     * @return {Object}       The new point
     */
    convertMapToRealUnit({ x, y }) {
        return {
            x: (x + 0.5) * MAP_X_UNIT,
            y: (y + 0.5) * MAP_Y_UNIT,
        };
    }

     /**
      * Converts a path to a sequence of robot.goTos
      *
      * @param  {Array} path An astar path
      * @return {Sequence}   The result sequence
      * @private
      */
    pathToSequence(path) {
        let sequence = new Sequence();

        for (var i = 0; i < path.length; i++) {
            let [x_, y_,] = path[i];

            let { x, y, } = this.convertMapToRealUnit({ x_, y_ });

            sequence.next(() => this.robot.goTo(x, y));
        }

        return sequence;
    }

    /**
     * Makes the robot navigate to the next objective
     *
     * @param  {Object} objective The objective
     * @return {Promise}          The started sequence
     * @private
     */
    goToNext(objective) {
        let { x, y, theta } = this.objectives[objective].startPoint;
        let pathToNext      = this.finder.findTo(this.objectives[objective]);
        let sequence        = this.pathToSequence(pathToNext);

        sequence.start();
        return sequence;
    }

    /**
     * Gets the score (based on deplacement cost and reward obtained)
     *
     * @param  {Object} objective The objective
     * @return {Object}           An object containing astar path and calculated score
     * @private
     */
    getObjectiveScore(objective) {
        let path = this.finder
            .setTo(objective.mapPoint.x, objective.mapPoint.y)
            .find();

        if (!path) {
            return -1;
        }

        let pathLength = Pathfinding.getFullLength(path);

        if (pathLength === 0) {
            return Infinity;
        }

        let score = objective.reward / pathLength;

        return { score, path, };
    }
}

export default IA;

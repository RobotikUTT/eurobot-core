import fs from 'fs';

let objectives = {};

for (let file of fs.readdirSync(__dirname)) {
    if (file === 'index.js') {
        continue;
    }

    let objectiveName = file.slice(0, -3);
    objectives[objectiveName] = require(`./${file}`);
}

export default objectives;

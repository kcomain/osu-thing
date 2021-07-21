import * as app from './src/osu-thing/app.js';

import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const package_file = fs.readFileSync('./package.json'); // eslint-disable-line no-sync
const packages = JSON.parse(package_file.toString());

console.log(`${chalk.blue('Test authorization and osu! api client')} %s`, chalk.green(`v${packages.version}`));
console.log(`Copyright (${chalk.gray(packages.license)}) 2021-present ${chalk.redBright(packages.author)}`)

/**
 * Get port
 * @returns {number} the port number fetched
 */
function get_port () {
    if (process.env.PORT === undefined) {
        console.warn(chalk.magenta('Warning: port is not defined or unreadable.' +
                                       ' Using the default port (8080)'));
        return 8080; // default
    }
    return Number(process.env.PORT);

}

app.run(get_port());
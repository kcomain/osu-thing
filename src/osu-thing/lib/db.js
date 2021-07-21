// import Pool from 'pg';
import process from 'process';
import { loggers } from './utils.js'

process.on('uncaughtExceptionMonitor', (err, origin) => {
    loggers.database(`Unhandled exception (${origin}) caught. Stack trace: 
    ${err.stack}`);
});



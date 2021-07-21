import process from 'process';
import debug from 'debug';

export const loggers = {
    core: debug('core'),
    app: debug('app'),
    express: debug('express')
};
loggers.http = loggers.app.extend('http');
loggers.oauth = loggers.http.extend('oauth');
loggers.ws = loggers.http.extend('websocket');
loggers.database = loggers.app.extend('database');

if (process.env.DEBUG == '1') {
    // debug.enable('app,app:*,express,express:*,core');
    debug.enable('*');
    loggers.core('Enabled app-wide debug');
}

for (const logger in loggers){
    // console.log(logger);
    // console.log(typeof loggers[logger]);
    loggers[logger]('initialized logger');
}

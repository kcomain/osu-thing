import chalk from "chalk";
import express from "express";
import fs from "fs";
import path from "path";
import process from "process";

import { loggers } from "./lib/utils.js";

/**
 * Setup routes
 * @param {Express} app Express app instance
 * @return {void} Nothing
 */
function setup_routes(app) {
    const routes_path = new URL("./routes", import.meta.url);

    const import_function = (file) => {
        import(new URL(`./routes/${file}`, import.meta.url))
            .then((module) => {
                app.use(module.router);
                console.log(
                    chalk.green(`loaded routes from file ${chalk.blue("%s")}`),
                    file
                );
            })
            .catch((err) => {
                console.log(
                    chalk.red(`Cannot load ./routes/${file}: ${err.message}`)
                );
            });
    };

    fs.readdir(routes_path, (err, files) => {
        if (err) {
            console.log(chalk.red(`Failed to scan directory ${err}`));
        }
        loggers.app(`files: ${files}`);
        loggers.app(`path: ${routes_path}`);
        files.forEach(import_function);
    });

    // This is the greatest idea i could think of with my 4 am brain
    // please send better cod e if you have one pplosx
    loggers.app("ensuring all routes are loaded before engaging error hander");
    setTimeout(() => {
        app.use(masterErrorHandler);
        loggers.app("registered master error handler");
    }, 1000);

    // noinspection JSValidateTypes
    return app;
}

/**
 * log http requests
 * @param req {express.request} request object
 * @param res {express.response} response object
 * @param next {function} next function
 * @returns {void} Nothing
 */
function log_httpreqs(req, res, next) {
    loggers.http(`${req.ip} ${req.method} ${req.originalUrl}`);
    next();
}

/**
 * Error handler
 * @param {Error} err Error thrown
 * @param {express.request} req request object
 * @param {express.response} res response object
 * @param {function} next function
 * @returns {void} Nothing
 */
function masterErrorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }
    console.error(`Error thrown: ${error}`);
    error.stack.replace("\n", "<br>");
    res.status(500).render("error", {
        body: `Encountered error: <code>${error.toString()}</code>`,
        stacktrace: process.env.NODE_ENV !== "production" ? error.stack : "",
    });
}

/**
 * Run express
 * @param {int} port The port for the server to listen on
 * @returns {void} Nothing
 */
export function run(port) {
    loggers.app("Loading routes...");
    const app = express();

    /**
     * Routes endpoint function
     * @param req {Express.Request} request object
     * @param res {Express.Response} response object
     * @returns {null} Nothing
     */
    function routes(req, res) {
        const routings = {};
        app._router.stack.forEach((middleware) => {
            // eslint-disable-line no-underscore-dangle
            if (middleware.route) {
                routings[middleware.route.path] = middleware.route;
            } else if (middleware.name === "router") {
                middleware.handle.stack.forEach((route) => {
                    const routing = route.route;
                    if (routing) {
                        routings[routing.path] = routing;
                    }
                });
            }
        });
        res.json({ routes: routings });
    }

    app.set("view engine", "ejs");
    app.set("views", process.cwd() + "/src/osu-thing/views");
    // app.use('/static', express.static(
    //     path.join(process.cwd(), 'src/osu-thing/static')
    //     ))

    app.use(log_httpreqs);
    app.get("/routes", routes);

    // noinspection JSCheckFunctionSignatures
    setup_routes(app);

    loggers.app("Running express");
    console.log(
        `${chalk.magenta("Listening on port")} ${chalk.blue("%s")}`,
        port
    );
    app.listen(port);
}

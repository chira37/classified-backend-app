/* eslint-disable @typescript-eslint/no-explicit-any */
import morgan from "morgan";
import chalk from "chalk";
import { Request, Response } from "express";
const morganConfig = morgan(function (tokens: any, req: Request, res: Response) {
    return [
        chalk.hex("#34ace0").bold(tokens.method(req, res)),
        chalk.hex("#BEAEE2").bold(tokens.url(req, res)),
        chalk.hex("#ffb142").bold(tokens.status(req, res)),
        chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
    ].join(" ");
});

export default morganConfig;

import winston from "winston";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
};

const colors = {
    fatal: "red",
    error: "magenta",
    warn: "yellow",
    info: "blue",
    http: "cyan",
    debug: "green",
};

winston.addColors(colors);

const currentLevel = config.LOG_LEVEL;
const isTestEnvironment = config.NODE_ENV === "test";
const isDevelopmentEnvironment = config.NODE_ENV === "development";
const logsDirectory = path.join(__dirname, "../../logs");

if (!isTestEnvironment) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}

const consoleFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metadata =
            Object.keys(meta).length > 0
                ? ` ${JSON.stringify(meta)}`
                : "";

        return `${timestamp} [${level}] ${message}${metadata}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const transports = isTestEnvironment
    ? []
    : [
        new winston.transports.File({
            filename: path.join(logsDirectory, "combined.log"),
            level: "info",
            format: fileFormat,
        }),
        new winston.transports.File({
            filename: path.join(logsDirectory, "error.log"),
            level: "error",
            format: fileFormat,
        }),
        ...(isDevelopmentEnvironment
            ? [new winston.transports.Console({
                level: currentLevel,
                format: consoleFormat,
            })]
            : []),
    ];

const logger = winston.createLogger({
    level: currentLevel,
    levels,
    transports,
    silent: isTestEnvironment,
    exitOnError: false,
});

export default logger;
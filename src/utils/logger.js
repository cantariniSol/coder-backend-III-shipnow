import winston from "winston";
import "winston-daily-rotate-file";
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

const currentLevel =
    config.NODE_ENV === "development" ? "debug" : "info";

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

const transports = [
    new winston.transports.Console({
        level: currentLevel,
        format: consoleFormat,
    }),

    new winston.transports.DailyRotateFile({
        filename: path.join(__dirname, "../../logs/application-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        level: "info",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: fileFormat,
    }),

    new winston.transports.DailyRotateFile({
        filename: path.join(__dirname, "../../logs/error-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        level: "error",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: fileFormat,
    }),
];

const logger = winston.createLogger({
    level: currentLevel,
    levels,
    transports,
    exitOnError: false,
});

export default logger;
import dotenv from "dotenv";

const environment =
    process.env.NODE_ENV || "development";

const envFile = {
    development: ".env.dev",
    test: ".env.test",
}[environment];

dotenv.config({ path: envFile });

export default environment;
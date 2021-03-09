const defaultConfig = require("./config");
const devConfig = require("./config.dev");
const prodConfig = require("./config.prod");

const config = defaultConfig;

if (process.env.NODE_ENV === "development") {
  config = devConfig;
}

if (process.env.NODE_ENV === "production") {
  config = prodConfig;
}

module.exports = config;

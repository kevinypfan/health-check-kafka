module.exports = {
  "dev001-api": {
    host: "http://localhost:8085",
    endpoint: "/actuator/health",
    topic: "dev",
    partition: 0,
  },
  "dev001-gw": {
    host: "http://localhost:8084",
    endpoint: "/actuator/health",
    topic: "dev",
    partition: 1,
  },
  "dev001-lb4": {
    host: "http://localhost:8090",
    endpoint: "/actuator/health",
    topic: "dev",
    partition: 2,
  },
};

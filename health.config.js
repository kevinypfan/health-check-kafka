module.exports = {
  "dev-api": {
    host: "http://localhost:8085",
    endpoint: "/actuator/health",
    topic: "test",
    partition: 0,
  },
  "dev-gw": {
    host: "http://localhost:8084",
    endpoint: "/actuator/health",
    topic: "test",
    partition: 1,
  },
  "dev-lb4": {
    host: "http://localhost:3000",
    endpoint: "/actuator/health",
    topic: "test",
    partition: 2,
  },
};

module.exports = {
  "test-api": {
    host: "http://localhost:8085",
    endpoint: "/actuator/health",
    topic: "test",
    partition: 0,
  },
  "test-gw": {
    host: "http://localhost:8084",
    endpoint: "/actuator/health",
    topic: "test",
    partition: 1,
  },
  "test-lb4": {
    host: "http://localhost:3000",
    endpoint: "/actuator/health",
    topic: "test",
    partition: 2,
  },
};

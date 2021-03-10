require("dotenv").config();
const config = require("./configs");
const Kafka = require("node-rdkafka");
const ProducerService = require("./services/ProducerService");

console.log(config);

const kafkaConf = {
  "group.id": "cloudkarafka-test-producer",
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
  // debug: "generic,broker,security",
};

const producer = new Kafka.Producer(kafkaConf);
const producerService = new ProducerService(producer, config);
producer.on("ready", producerService.ready);

producer.on("disconnected", producerService.disconnected);

producer.on("event.error", producerService.eventError);
producer.on("event.log", producerService.eventLog);
producer.connect();

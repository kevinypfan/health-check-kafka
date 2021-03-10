require("dotenv").config();
const config = require("./configs");
var Kafka = require("node-rdkafka");
const ConsumerService = require("./services/ConsumerService");

var kafkaConf = {
  "group.id": "cloudkarafka-test-consumer",
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
  // debug: "generic,broker,security",
};

const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "latest",
});
const consumerService = new ConsumerService(consumer, config);

consumer.on("error", consumerService.error);
consumer.on("ready", consumerService.ready);
consumer.on("data", consumerService.data);
consumer.on("disconnected", consumerService.disconnected);
consumer.on("event.error", consumerService.eventError);
consumer.on("event.log", consumerService.eventLog);

consumer.connect();

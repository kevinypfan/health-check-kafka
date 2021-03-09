require("dotenv").config();

var Kafka = require("node-rdkafka");

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

const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topics = [`${prefix}test`];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning",
});

const numMessages = 5;
let counter = 0;
consumer.on("error", function (err) {
  console.log("on error");
  console.error(err);
});
consumer.on("ready", function (arg) {
  console.log("on ready");
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);

  var timeout = 5000,
    partition = 3;
  consumer.queryWatermarkOffsets(
    topics[0],
    partition,
    timeout,
    function (err, offsets) {
      console.log(offsets);
      consumer.assign([
        { topic: topics[0], partition, offset: offsets.highOffset - 8 },
      ]);
    }
  );

  consumer.consume();
});
consumer.on("data", function (m) {
  counter++;
  if (counter % numMessages === 0) {
    console.log("calling commit");
    consumer.commit(m);
  }
  console.log(m);
  console.log(m.value.toString());
});
consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on("event.error", function (err) {
  console.error(err);
  process.exit(1);
});
consumer.on("event.log", function (log) {
  console.log(log);
});
consumer.connect();

setTimeout(function () {
  consumer.disconnect();
}, 300000);

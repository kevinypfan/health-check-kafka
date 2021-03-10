const LineNotifyService = require("./LineNotifyService");

class ConsumerService {
  constructor(consumer, config) {
    this.consumer = consumer;
    this.config = config;
    this.prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
    this.lineNotifyService = new LineNotifyService(
      process.env.LINE_NOTIFY_TOKENS.split(",")
    );
  }

  ready = (arg) => {
    console.log(`Consumer ${arg.name} ready`);
    const apiDataList = Object.values(this.config);
    const topics = apiDataList.map((data) => `${this.prefix}${data.topic}`);
    const topicSet = new Set(topics);
    this.consumer.subscribe(Array.from(topicSet));
    this.consumer.consume();
  };

  data = (message) => {
    console.log(`${message.key} => ${message.value.toString()}`);
    const dataObj = JSON.parse(message.value.toString());
    if (dataObj.status === "DOWN") {
      this.lineNotifyService.sendLineNotify(
        `${message.key} 服務發生中斷：${message.value.toString()}`
      );
    }
  };

  disconnected = (arg) => {
    process.exit();
  };
  eventError = (err) => {
    console.error(err);
    process.exit(1);
  };
  eventLog = (log) => {
    console.log(log);
  };

  error = (err) => {
    console.error(err);
  };
}

module.exports = ConsumerService;

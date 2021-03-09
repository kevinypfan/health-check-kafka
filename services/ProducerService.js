const axios = require("axios");
const utils = require("../utils");

class ProducerService {
  constructor(producer, config) {
    this.producer = producer;
    this.config = config;
    this.prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
    this.topic = `${this.prefix}${this.config["dev-api"].topic}`;
  }

  runForever = async (func, api, ms) => {
    // Make Async Call
    try {
      const { data } = await func();
      let publishData;
      if (data.info) {
        publishData = { ...data.info };
      } else {
        publishData = { ...data };
      }
      this.producer.produce(
        this.topic,
        this.config[api].partition,
        Buffer.from(JSON.stringify(publishData)),
        api
      );
    } catch (error) {
      let publishData;
      if (error.response.data) {
        publishData = error.response.data;
      } else {
        publishData = {
          status: "DOWN",
          error: error.code,
        };
      }
      this.producer.produce(
        this.topic,
        this.config[api].partition,
        Buffer.from(JSON.stringify(publishData)),
        api
      );
    }

    // Wait X ms Before Processing Continues
    await utils.delay(ms);

    if (true) {
      // not needed, but there you could define an end condition
      return this.runForever(func, api, ms);
    }
  };

  ready = (arg) => {
    const apis = Object.keys(this.config);

    apis.forEach((api) => {
      this.runForever(
        () => axios.get(`${this.config[api].host}${this.config[api].endpoint}`),
        api,
        60000
      );
    });
  };
  disconnected(arg) {
    process.exit();
  }
  eventError(err) {
    console.error(err);
    process.exit(1);
  }
  eventLog(log) {
    console.log(log);
  }
}

module.exports = ProducerService;

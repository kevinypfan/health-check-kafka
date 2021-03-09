require("dotenv").config();
const LineNotifyService = require("./services/LineNotifyService");

const lineNotifyService = new LineNotifyService(
  process.env.LINE_NOTIFY_TOKENS.split(",")
);

lineNotifyService.sendLineNotify("test message");

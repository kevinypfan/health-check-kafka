const axios = require("axios");
const Qs = require("qs");
class LineNotifyService {
  constructor(tokens) {
    this.tokens = tokens;
  }

  httpBuildQuery = (obj) => {
    return Qs.stringify(obj, { arrayFormat: "brackets" });
  };

  photoScreenView = (lineId, name) => {
    return `https://example.cloudfunctions.net/linebot-notify-ga-demo-20200629?${httpBuildQuery(
      {
        name,
        line_id: lineId,
        z: +new Date(),
      }
    )}`;
  };

  sendLineNotify = async (message) => {
    try {
      console.log(this.tokens);
      const promiseArray = this.tokens.map((token) => {
        return axios.post(
          "https://notify-api.line.me/api/notify",
          this.httpBuildQuery({
            message,
          }),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      });
      await Promise.all(promiseArray);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = LineNotifyService;

const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.resolve.alias.set(
        "@remote-api",
        path.resolve(__dirname, "src/services/remote-api/")
      );
    } else {
      config.resolve.alias.set(
        "@remote-api",
        path.resolve(__dirname, "mock/services/remote-api/")
      );
    }
  },
};

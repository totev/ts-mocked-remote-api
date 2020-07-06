module.exports = {
  devServer: {
    proxy: {
      "/anime-api": {
        pathRewrite: {
          "^/anime-api/": "/", // remove prefix
        },
        target: "http://localhost:4100/",
        ws: true,
        changeOrigin: true,
        logLevel: "debug",
      },
    },
  },
};

const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/env");

module.exports = createProxyMiddleware({
  target: config.MOVIE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/movies": ""
  }
});
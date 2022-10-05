import config from "./config.json";

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "",
        createProxyMiddleware({
            target: config.server,
            changeOrigin: true,
        })
    )
}
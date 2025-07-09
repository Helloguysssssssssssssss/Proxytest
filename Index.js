const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));

// Dynamic proxy route
app.use("/proxy", (req, res, next) => {
  const target = req.query.url;
  if (!target || !/^https?:\/\//.test(target)) {
    return res.status(400).send("Invalid or missing 'url' query parameter.");
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: () => "/",
    onError(err, req, res) {
      res.status(500).send("Proxy Error: " + err.message);
    }
  })(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

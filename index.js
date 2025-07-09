const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Proxy handler
app.use("/proxy", (req, res, next) => {
  const target = req.query.url;
  if (!target || !/^https?:\/\//.test(target)) {
    return res.status(400).send("Missing or invalid 'url' query parameter.");
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

// Fallback for unknown routes (optional)
app.use((req, res) => {
  res.status(404).send("Page not found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

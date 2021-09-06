const express = require("express");
const http = require("http");
const routes = require("./routes");

// Set api
const app = express();
app.use("/", routes);

// app.use(limiter.fixedWindowLimiter(redis_client, 3600, 5, req.ip));

//error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Set up server
const port = process.env.PORT || "4000";
app.set("port", port);
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
});

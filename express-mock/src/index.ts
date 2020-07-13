import express from "express";
import * as bodyParser from "body-parser";

import anime from "./anime";

const loadModules = [anime];

const port = 4100;
console.log("> Starting backend mocks...");

const mocks = express();
mocks.use(bodyParser.json({ type: "*/*" }));
loadModules.forEach((type) => {
  type(mocks);
});

const server = mocks.listen(port);
console.log("> Listening on port " + port + "\n");

process.on("exit", () => {
  console.log("Stopping mock server... now");
  server.close();
});

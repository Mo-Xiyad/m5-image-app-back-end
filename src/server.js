import express from "express";

import path from "path";

import imagesRoute from "./images/route.js";

import { publicFolder } from "./utils/db.js";

import cors from "cors";

const PORT = 5000;

const server = express();

server.use(cors());

server.use(express.json());

server.use(express.static(publicFolder));

server.use("/images", imagesRoute);

server.listen(PORT, () => {
  console.log("✅ Server is started on ", PORT);
});

server.on("error", console.log);

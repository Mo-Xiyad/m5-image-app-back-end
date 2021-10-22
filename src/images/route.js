import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs-extra";
import mime from "mime";

import * as db from "../utils/db.js";

const upload = multer();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const images = await db.getImages();
    res.send(images);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const extension = path.extname(req.file.originalname);
    const id = uuid();
    const fileName = `${id}${extension}`;

    const file = {
      id,
      fileName,
      url: `http://localhost:5000/${fileName}`,
    };

    const filePath = path.join(db.publicFolder, fileName);

    await fs.writeFile(filePath, req.file.buffer);

    const fileObject = await db.insertImage(file);

    res.status(201).send(fileObject);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const image = await db.getImageById(req.params.id);

    const file = await fs.readFile(path.join(db.publicFolder, image.fileName));

    const base64Data = file.toString("base64");

    const mimeType = mime.getType(image.fileName);

    image.data = `data:${mimeType};base64,${base64Data}`;

    res.send(image);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.deleteImage(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const extension = path.extname(req.file.originalname);
    const fileName = `${req.params.id}${extension}`;
    const filePath = path.join(db.publicFolder, fileName);
    await fs.writeFile(filePath, req.file.buffer);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;

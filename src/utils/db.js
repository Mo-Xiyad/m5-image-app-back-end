import fs from "fs-extra";

import path from "path";

export const dataFolder = path.join(process.cwd(), "data");

export const publicFolder = path.join(process.cwd(), "public");

/**
 *   reading images from json file in data folder
 */

export const getImages = () =>
  fs.readJSON(path.join(dataFolder, "images.json"));

/**
 *   reading images from json file in data folder
 *
 *  @param obj {Object}
 *  obj = {
 *  "id":"1234-1234-12388",
 *  "fileName":"1234-1234-12388.png",
 *   "link":"http://localhost/1234-1234-12388.png"
 * }
 */

export const insertImage = async (obj) => {
  try {
    console.log(obj);
    //  read image array
    const images = await getImages();
    // push new object
    images.push(obj);

    // write back to disk
    await fs.writeJSON(path.join(dataFolder, "images.json"), images);

    return obj;
  } catch (error) {
    // if error occurred log it
    console.log(error);
  }
};

export const getImageById = async (id) => {
  try {
    // read image array
    const images = await getImages();
    // find image by id
    const image = images.find((image) => image.id === id);
    if (image) {
      console.log({ image });
      // if its found return
      return image;
    } else {
      // else throw error!
      throw new Error(`Image with ${id} is not found!`);
    }
  } catch (error) {
    throw new Error(`Image with ${id} is not found!`);
  }
};

export const deleteImage = async (id) => {
  try {
    // find image by id
    let images = await getImages();
    const image = images.find((image) => image.id === id);
    if (image) {
      images = images.filter((image) => image.id !== id);
      const filePath = path.join(publicFolder, image.fileName);
      await fs.unlink(filePath);
      await fs.writeJSON(path.join(dataFolder, "images.json"), images);
      return image;
    } else {
      throw new Error(`Image with ${id} is not found!`);
    }
  } catch (error) {
    console.log(error);
  }
};
